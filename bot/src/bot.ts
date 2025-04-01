// Import necessary modules and services
import { Telegraf } from 'telegraf';
import sharp from 'sharp';
import { fetchData } from './services/fetchData';
import { generateCandleChartSvg } from './charts/generateCandleChartSvg';
import { createClient } from 'redis';
import { fetchLlm } from './services/fetchLlm';

// Define the structure for cryptocurrency data
interface CoinData {
  symbol: string;
  name: string;
  pool: string;
}

// List of supported cryptocurrencies
const CoinsData: CoinData[] = [
  { symbol: 'CRO', name: 'Cronos Coin', pool: "0xe61db569e231b3f5530168aa2c9d50246525b6d6" },
  { symbol: 'BTC', name: 'Bitcoin', pool: "0x8f09fff247b8fdb80461e5cf5e82dd1ae2ebd6d7" },
  { symbol: 'ETH', name: 'Ethereum', pool: "0xa111c17f8b8303280d3eb01bbcd61000aa7f39f9" }
];

// Initialize the Telegram bot
const bot = new Telegraf(process.env.BOT_TOKEN!);

// Initialize Redis client for state management
const redisClient = createClient({
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : undefined
  }
})
redisClient.on('error', (err) => console.error('Redis Client Error', err));

// Define the structure for user state
type State = {
  privateKey: string;
  step: number;
  csvData: string | null;
  lastActivity: number;
  dailyCredit: number;
};

// Helper functions for managing user state in Redis
async function setUserState(userId: string, state: State) {
  await redisClient.set(userId, JSON.stringify(state));
}

async function getUserState(userId: string): Promise<State | null> {
  const state = await redisClient.get(userId);
  return state ? JSON.parse(state) : null;
}

async function deleteUserState(userId: string) {
  await redisClient.del(userId);
}

// Ensure Redis client is connected before performing operations
async function ensureRedisConnected() {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
}

// Timeout duration for user sessions
const TIMEOUT_DURATION = 60 * 1000; // 1 minute in milliseconds

// Check if a user's session has timed out
async function isSessionTimedOut(lastActivity: number): Promise<boolean> {
  if (!lastActivity && lastActivity > 0) return false;

  const timeSinceLastActivity = Date.now() - lastActivity;
  return timeSinceLastActivity > TIMEOUT_DURATION;
}

// Handle the /start command to initialize the bot and user state
bot.start(async (ctx) => {
  await ensureRedisConnected(); // Ensure Redis is connected
  const userId = ctx.from.id.toString();
  setUserState(userId, { privateKey: '', step: 0, csvData: '', lastActivity: Date.now(), dailyCredit: 5 }); // Initialize user state

  ctx.reply(
    "Welcome to the Crypto Analysis Bot! 🤖\n\n" +
    "This bot helps you analyze onchain cryptocurrency data in cronos blockchain and generate insights. Here's what you can do:\n" +
    "- Use the /analysis command to analyze specific cryptocurrency pools.\n" +
    "- Provide parameters like pool, timeframe, aggregate, and limit to fetch OHLCV data.\n" +
    "- Ask questions about the generated data for further insights.\n\n" +
    "Type /analysis to get started!" +
    "You have 5 credits to use the bot. Each analysis will consume 1 credit. If you want to know how many credits you have left, type /credits."
  );
});

// Handle the /analysis command to guide users on providing analysis parameters
bot.command('analysis', async (ctx) => {
  await ensureRedisConnected(); // Ensure Redis is connected
  const userId = ctx.from.id.toString();
  const coinSymbols = CoinsData.map(coin => coin.symbol).join(', ');

  ctx.reply(
    "Please provide the following parameters for data analysis in the format:\n" +
    "pool timeframe aggregate limit\n\n" +
    "Available pools (use the symbol for the pool parameter):\n" +
    `${coinSymbols}\n\n` +
    "Available values for timeframe:\n" +
    "- day: Time period to aggregate for each OHLCV (e.g., 1 day)\n" +
    "- hour: Time period to aggregate for each OHLCV (e.g., 4 hours)\n" +
    "- minute: Time period to aggregate for each OHLCV (e.g., 15 minutes)\n\n" +
    "Available values for aggregate:\n" +
    "- day: 1\n" +
    "- hour: 1, 4, 12\n" +
    "- minute: 1, 5, 15\n" +
    "Limit: Number of OHLCV results to return, max: 1000\n" +
    "Example: `0xe61db569e231b3f5530168aa2c9d50246525b6d6 day 1 100`"
  );
  let state = await getUserState(userId);
  if (state) {
    await setUserState(userId, { ...state, step: 1, csvData: null, lastActivity: Date.now() });
  }
});

// Duration for resetting daily credits
const DAILY_RESET_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Handle daily credit management and user queries about remaining credits
const handleDayleyCredit = async (ctx: any, state: State) => {
  const userMessage = ctx.message.text;
  const userId = ctx.from.id.toString();
  await ensureRedisConnected(); // Ensure Redis is connected
  if (state) {
    const timeSinceLastActivity = Date.now() - state.lastActivity;
    // Reset daily credit if more than 24 hours have passed
    if (timeSinceLastActivity > DAILY_RESET_DURATION) {
      state.dailyCredit = 5;
    }
    if (userMessage === "/credits") {
      ctx.reply(`You have ${state.dailyCredit} credits left, for use daily daily.`);
      return true;
    } else {
      if (state.dailyCredit > 0) {
        await setUserState(userId, { ...state, dailyCredit: state.dailyCredit - 1, lastActivity: Date.now() });
        ctx.reply(`You have ${state.dailyCredit - 1} daily credits left.`);
        return true;
      } else {
        ctx.reply("You have no daily credits left. Please wait until tomorrow to use the bot again.");
        return false;
      }
    }
  } else {
    ctx.reply("No user state found. Please start the bot with /start.");
    return false;
  }
};

// Handle the /credits command to display remaining daily credits
bot.command('credits', async (ctx) => {
  await ensureRedisConnected(); // Ensure Redis is connected
  const userId = ctx.from.id.toString();
  let state = await getUserState(userId);
  if (state) {
    handleDayleyCredit(ctx, state);
  } else {
    ctx.reply("No user state found. Please start the bot with /start.");
  }
});

// Handle user messages and process analysis requests or follow-up questions
bot.hears(/.*/, async (ctx) => {
  const userId = ctx.from.id.toString();
  await ensureRedisConnected();
  let state = await getUserState(userId);

  if (state) {
    if (await isSessionTimedOut(state?.lastActivity)) {
      ctx.reply(`Session timed out. Please start over.`);
      await setUserState(userId, { ...state, lastActivity: Date.now() });
    } else {
      if (state.step === 1) {
        const userMessage = ctx.message.text.trim();
        const params = userMessage.split(' ');

        if (params.length !== 4) {
          ctx.reply(
            "Invalid input format. Please provide the parameters in the format:\n" +
            "`pool timeframe aggregate limit`\n" +
            "Example: `0xe61db569e231b3f5530168aa2c9d50246525b6d6 day 1 100`"
          );
          return;
        }

        let [pool, timeframe, aggregate, limit] = params;

        // Validate pool
        const coin = CoinsData.find(coin => coin.symbol.toLowerCase() === pool.toLowerCase());
        if (coin) {
          pool = coin.pool; // Use the pool from CoinsData if a symbol is provided
        }

        // Validate timeframe
        const validTimeframes = ['day', 'hour', 'minute'];
        if (!validTimeframes.includes(timeframe)) {
          ctx.reply("Invalid timeframe. Available values: day, hour, minute.");
          return;
        }

        // Validate aggregate
        const validAggregates: Record<string, number[]> = {
          day: [1],
          hour: [1, 4, 12],
          minute: [1, 5, 15],
        };
        if (!validAggregates[timeframe].includes(parseInt(aggregate))) {
          ctx.reply(`Invalid aggregate value for ${timeframe}. Available values: ${validAggregates[timeframe].join(', ')}.`);
          return;
        }

        // Validate limit
        const limitValue = parseInt(limit);
        if (isNaN(limitValue) || limitValue < 1 || limitValue > 1000) {
          ctx.reply("Invalid limit. Please provide a number between 1 and 1000.");
          return;
        }

        // Fetch data and generate chart
        try {
          const data = await fetchData(pool, timeframe, parseInt(aggregate), limitValue);
          const svgString = generateCandleChartSvg(data.json);
          const pngBuffer = await sharp(Buffer.from(svgString)).png().toBuffer();
          await ctx.replyWithPhoto({ source: pngBuffer });
          ctx.reply("Here is your chart. Let me know if you need further analysis.");
          await setUserState(userId, { ...state, step: 2, csvData: data.csv, lastActivity: Date.now() });
        } catch (error) {
          console.error('Error fetching data:', error);
          ctx.reply('Failed to fetch data. Please try again later.');
        }
      }

      if (state.step === 2) {
        const userMessage = ctx.message.text;
        if (userMessage === "/bye") {
          ctx.reply("Bye");
          await setUserState(userId, { ...state, step: 0, csvData: null, lastActivity: Date.now() });
        } else {
          if (state.csvData) {
            const analysis = await fetchLlm(userMessage, state.csvData);
            if (analysis.length > 0) {
              const plainTextResponse = analysis.replaceAll("CSV data", "data")
                .replace(/^\s*\*\s+/gm, '') // Remove bullet points
                .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold formatting (**text**)
                .replace(/_(.*?)_/g, '$1') // Remove italic formatting (_text_)
                .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links ([text](url))
                .replace(/`/g, '') // Remove inline code formatting
                .replace(/~~(.*?)~~/g, '$1') // Remove strikethrough formatting (~~text~~)
                .replace(/>/g, '') // Remove blockquote markers
                .replace(/\n/g, '\n'); // Preserve newlines
              ctx.reply(plainTextResponse);
              handleDayleyCredit(ctx, state);
              ctx.reply("Have your other questions?\nIf not, type /bye");
              await setUserState(userId, { ...state, lastActivity: Date.now() });
            }
          }
        }
      }
    }
  }
});

// Export the bot instance for use in other parts of the application
export default bot;
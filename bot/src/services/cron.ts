import { CronJob } from 'cron';
import bot from '../bot';
import { fetchTokens } from './fetchTokens';
import { fetchData } from './fetchData';
import { fetchLlm } from './fetchLlm';
import { ensureRedisConnected } from './redis';
import redisClient from './redis';

const GROUP_CHAT_ID = process.env.GROUP_CHAT_ID; // Ensure this is set in the environment variables

// Hourly cron job
const hourlyJob = new CronJob('0 * * * *', async () => {
    console.log('Hourly cron is running at', new Date().toLocaleString());
    try {
        await ensureRedisConnected();

        const tokens = await fetchTokens();

        for (const token of tokens) {
            const symbol = token.symbol;
            const newPrice = parseFloat(token.price_usd);
            const topPools = token.top_pools; // Get top pools for the current token

            // Fetch the previous price from Redis
            const previousPrice = await redisClient.get(`token:${symbol}`);
            if (previousPrice) {
                const priceChange = ((newPrice - parseFloat(previousPrice)) / parseFloat(previousPrice)) * 100;
                console.log(priceChange,newPrice,previousPrice);
                console.log(Math.abs(priceChange) > 5);
                // Check if the price change exceeds ±5%
                if (Math.abs(priceChange) > 5) {
                    console.log(`Price change for ${symbol} exceeds ±5%: ${priceChange.toFixed(2)}%`);

                    // Call fetchData for the token's top pools
                    const data = await fetchData(topPools, "minute",15, 96);
                    console.log(`Fetched data for ${symbol}'s top pools: ${JSON.stringify(data.json)}`);

                    if (GROUP_CHAT_ID) {
                        const analysis = await fetchLlm("analysis the 24 hours data and write a short analysis report about the lasted price and volume change", data.csv);
                        const plainTextResponse = analysis.replaceAll("CSV data", "data")
                            .replace(/^\s*\*\s+/gm, '') // Remove bullet points
                            .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold formatting (**text**)
                            .replace(/_(.*?)_/g, '$1') // Remove italic formatting (_text_)
                            .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links ([text](url))
                            .replace(/`/g, '') // Remove inline code formatting
                            .replace(/~~(.*?)~~/g, '$1') // Remove strikethrough formatting (~~text~~)
                            .replace(/>/g, '') // Remove blockquote markers
                            .replace(/\n/g, '\n'); // Preserve newlines
                        const MESSAGE = `Price change alert for ${symbol}: ${plainTextResponse}`;
                        await bot.telegram.sendMessage(GROUP_CHAT_ID, MESSAGE);
                    } else {
                        console.log('GROUP_CHAT_ID is not set');
                    }
                }
            }

            // Update the price in Redis
            await redisClient.set(`token:${symbol}`, newPrice.toString());
        }
    } catch (error) {
        console.error("Error in Hourly CronJob:", error);
    }
});

// Daily cron job (runs at midnight)
const dailyJob = new CronJob('0 0 * * *', async () => {
    console.log('Daily cron is running at', new Date().toLocaleString());
    try {
        await ensureRedisConnected();

        const tokens = await fetchTokens();

        for (const token of tokens) {
            const symbol = token.symbol;
            const newPrice = parseFloat(token.price_usd);
            const topPools = token.top_pools; // Get top pools for the current token

            // Fetch the previous price from Redis
            const previousPrice = await redisClient.get(`token:${symbol}`);
            if (previousPrice) {
                const priceChange = ((newPrice - parseFloat(previousPrice)) / parseFloat(previousPrice)) * 100;
                console.log(priceChange,newPrice,previousPrice);
                console.log(Math.abs(priceChange) > 5);
                // Check if the price change exceeds ±5%
                if (Math.abs(priceChange) > 5) {
                    console.log(`Price change for ${symbol} exceeds ±5%: ${priceChange.toFixed(2)}%`);

                    // Call fetchData for the token's top pools
                    const data = await fetchData(topPools, "day",1, 3);
                    console.log(`Fetched data for ${symbol}'s top pools: ${JSON.stringify(data.json)}`);

                    if (GROUP_CHAT_ID) {
                        const analysis = await fetchLlm("analysis the 3 days of data and write a short analysis report about the lasted price and volume change", data.csv);
                        const plainTextResponse = analysis.replaceAll("CSV data", "data")
                            .replace(/^\s*\*\s+/gm, '') // Remove bullet points
                            .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold formatting (**text**)
                            .replace(/_(.*?)_/g, '$1') // Remove italic formatting (_text_)
                            .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links ([text](url))
                            .replace(/`/g, '') // Remove inline code formatting
                            .replace(/~~(.*?)~~/g, '$1') // Remove strikethrough formatting (~~text~~)
                            .replace(/>/g, '') // Remove blockquote markers
                            .replace(/\n/g, '\n'); // Preserve newlines
                        const MESSAGE = `Price change alert for ${symbol}: ${plainTextResponse}`;
                        await bot.telegram.sendMessage(GROUP_CHAT_ID, MESSAGE);
                    } else {
                        console.log('GROUP_CHAT_ID is not set');
                    }
                }
            }

            // Update the price in Redis
            await redisClient.set(`token:${symbol}`, newPrice.toString());
        }
    } catch (error) {
        console.error("Error in Hourly CronJob:", error);
    }
});

export { hourlyJob, dailyJob };
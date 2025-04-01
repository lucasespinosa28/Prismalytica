# Prismalytica 
**Crypto Technical Analyst AI Agent**


[Website](https://prismalytica.pages.dev/)
## Project Description

This Telegram bot helps users analyze on-chain cryptocurrency data on the Cronos blockchain. It provides insights by fetching OHLCV (Open, High, Low, Close, Volume) data, generating candlestick charts, and answering user queries about the data.

## What the Bot Does

1. **Cryptocurrency Analysis**: Users can analyze specific cryptocurrency pools by providing parameters such as pool, timeframe, aggregate, and limit.
2. **Candlestick Charts**: The bot generates candlestick charts based on the requested data.
3. **Interactive Insights**: Users can ask questions about the data, and the bot uses an LLM (Large Language Model) to provide detailed answers.
4. **Session Management**: The bot tracks user sessions and manages daily credits using Redis.

For more details on how to use the bot, refer to the [Usage](#usage) section.

## Features

- Analyze cryptocurrency pools by providing parameters like pool, timeframe, aggregate, and limit.
- Generate candlestick charts for the requested data.
- Answer user questions about the data using an LLM (Large Language Model).
- Manage user sessions and daily credits using Redis.

## Prerequisites

Before running the bot, ensure you have the following installed:

1. **Node.js**: Version 16 or higher.
2. **Redis**: For managing user state and session data.
3. **Docker** (optional): For running Redis in a container.
4. **Telegram Bot Token**: Obtain one by creating a bot on Telegram via [BotFather](https://core.telegram.org/bots#botfather).

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd <repository-folder>
```

### 2. Install Dependencies

Navigate to the bot's source directory and install the required dependencies:

```bash
cd services/bot
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the `/src` directory and add the following:

```env
BOT_TOKEN=<your-telegram-bot-token>
```

Replace `<your-telegram-bot-token>` with the token you received from BotFather.

### 4. Start Redis

If you have Docker installed, you can start Redis using the following command:

```bash
docker run --name redis -p 6379:6379 -d redis
```

Alternatively, install Redis locally and ensure it is running on `localhost:6379`.

### 5. Run the Bot

Start the bot using the following command:

```bash
npm start
```

The bot will connect to Telegram and start listening for user commands.

## Usage

### Commands

- **/start**: Initializes the bot and sets up the user's state.
- **/analysis**: Guides the user to provide parameters for data analysis.
- **/credits**: Displays the remaining daily credits for the user.
- **/bye**: Ends the current session.

### Analysis Parameters

When using the `/analysis` command, provide the following parameters in the format:

```
pool timeframe aggregate limit
```

- **pool**: The cryptocurrency pool address or symbol (e.g., `BTC`, `ETH`).
- **timeframe**: The time period for aggregation (`day`, `hour`, `minute`).
- **aggregate**: The aggregation interval (e.g., `1`, `4`, `12`).
- **limit**: The number of OHLCV results to return (max: 1000).

Example:

```
0xe61db569e231b3f5530168aa2c9d50246525b6d6 day 1 100
```

### Credits

Each analysis consumes 1 credit. Users start with 5 daily credits, which reset every 24 hours.

## Code Overview

### Key Files

- **`src/bot.ts`**: Contains the main bot logic, including command handlers and user session management.
- **`src/services/fetchData.ts`**: Fetches OHLCV data from the blockchain.
- **`src/charts/generateCandleChartSvg.ts`**: Generates candlestick charts in SVG format.
- **`src/services/fetchLlm.ts`**: Sends user queries and CSV data to an LLM for analysis.

### Redis Integration

The bot uses Redis to store user state, including:

- `privateKey`: Placeholder for user-specific data.
- `step`: Tracks the user's current step in the workflow.
- `csvData`: Stores the CSV data for analysis.
- `lastActivity`: Timestamp of the user's last interaction.
- `dailyCredit`: Tracks the user's remaining daily credits.

### Error Handling

The bot includes error handling for:

- Invalid input formats.
- Session timeouts.
- Redis connection issues.

## Contributing

Feel free to submit issues or pull requests to improve the bot. Contributions are welcome!

## License

This project is licensed under the MIT License.

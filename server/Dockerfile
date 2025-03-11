FROM oven/bun:1.2.4-alpine

WORKDIR /app

# Copy package.json and bun.lock files
COPY package.json bun.lock ./

# Install dependencies
RUN bun install

# Copy the rest of the application
COPY . .

# Generate Prisma client
RUN bunx prisma generate --no-engine
# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["bun", "run", "index.ts"]
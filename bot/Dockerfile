# Use the official Bun image
FROM oven/bun:latest

# Set the working directory
WORKDIR /app
RUN apt-get update && apt-get install -y -q libfontconfig1
# Copy package.json, bun.lockb, and source code
COPY package.json ./
COPY . .

ENV FONTCONFIG_PATH=/etc/fonts
# Install dependencies
RUN bun install

# Expose the application port
EXPOSE 3000

ENV BOT_TOKEN=""
ENV REDIS_HOST=""
ENV REDIS_PORT=""
ENV REDIS_PASSWORD=""
ENV REDIS_USERNAME=""
# Start the application
CMD ["bun", "dev"]
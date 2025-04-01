import { Hono } from 'hono'
import { cors } from 'hono/cors'
import bot from './bot'  // Import the bot

const app = new Hono()
app.use('/*', cors({
  origin: '*',
  allowHeaders: ['Authorization', 'Content-Type'], // Add 'Content-Type' here
  allowMethods: ['POST', 'GET', 'OPTIONS'], // Add 'OPTIONS' for preflight requests
  exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
  maxAge: 600,
  credentials: true,
}))

app.get("/", async (c) => {
  return c.text("Hello Hono!")
})

// Initialize and launch the bot
bot.launch()
export default app
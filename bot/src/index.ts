import { Hono } from 'hono'
import { cors } from 'hono/cors'
import bot from './bot'  // Import the bot
import { hourlyJob, dailyJob } from './services/cron';
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
//0x5c7f8a570d578ed84e63fdfa7b1ee72deae1ae23,0x9d8c68f185a04314ddc8b8216732455e8dbb7e45,0x2d03bece6747adc00e1a131bba1469c15fd11e03,0x062e66477faf219f25d27dced647bf57c3107d52,0xccccccccdbec186dc426f8b5628af94737df0e60,0x3b41b27e74dd366ce27cb389dc7877d4e1516d4d,0x6b431b8a964bfcf28191b07c91189ff4403957d0,0xd2ee4bd0d1be7e84160dc459006f6e0970f8313c,0xdd73dea10abc2bff99c60882ec5b2b81bb1dc5b2,0xdbb3a75b102f1e65653adb19ee282d209843a1b6
// Initialize and launch the bot
bot.launch();

console.log("Bot started and listening for messages...", process.env.GROUP_CHAT_ID);

// Start the CronJob
hourlyJob.start();
dailyJob.start();
console.log("CronJobs started");
export default app
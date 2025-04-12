import { createClient } from 'redis';

const redisClient = createClient({
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    socket: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : undefined
    }
  })
  redisClient.on('error', (err) => console.error('Redis Client Error', err));


 export async function ensureRedisConnected() {
    if (!redisClient.isOpen) {
        await redisClient.connect();
    } else {
        console.log('Redis client is already connected');
    }
}


  export default redisClient;
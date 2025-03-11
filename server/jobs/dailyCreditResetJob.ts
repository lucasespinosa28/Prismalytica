import { CronJob } from 'cron';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Resets all users' daily credits back to 10
 */
async function resetDailyCredits() {
  try {
    const result = await prisma.user.updateMany({
      data: {
        dailyCredit: 10
      }
    });
    
    console.log(`Reset daily credits for ${result.count} users at ${new Date().toISOString()}`);
  } catch (error) {
    console.error('Error resetting daily credits:', error);
  }
}

/**
 * Creates a cron job that resets all users' daily credits to 10 every day at midnight
 * @returns The created CronJob instance
 */
export const initDailyCreditResetJob = (): CronJob => {
  // Schedule to run at 00:00:00 (midnight) every day
  const job = new CronJob('0 0 0 * * *', resetDailyCredits);
  
  // Start the job
  job.start();
  
  console.log('Daily credit reset job initialized');
  return job;
};
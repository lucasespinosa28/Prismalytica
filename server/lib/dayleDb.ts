import { PrismaClient } from '@prisma/client';

// Use the same Prisma client instance
const prisma = new PrismaClient();

/**
 * Creates a new daily analysis entry
 * @param message The analysis message content
 * @param prompt The prompt used to generate the analysis
 * @returns The created daily analysis object
 */
export async function createDailyAnalysis(message: string, prompt: string) {
  try {
    const daily = await prisma.dayle.create({
      data: {
        message,
        prompt,
        // timeStamp is automatically set to now() by default
      },
    });

    return daily;
  } catch (error) {
    console.error('Error creating daily analysis:', error);
    throw new Error('Failed to create daily analysis');
  }
}

/**
 * Retrieves all daily analysis entries
 * @param limit Optional limit for the number of entries to retrieve
 * @param offset Optional offset for pagination
 * @returns Array of daily analysis entries
 */
export async function getAllDailyAnalyses(limit?: number, offset?: number) {
  try {
    const daily = await prisma.dayle.findMany({
      orderBy: {
        timeStamp: 'desc', // Most recent first
      },
      ...(limit !== undefined && { take: limit }),
      ...(offset !== undefined && { skip: offset }),
    });

    return daily;
  } catch (error) {
    console.error('Error retrieving daily analyses:', error);
    throw new Error('Failed to retrieve daily analyses');
  }
}

/**
 * Retrieves daily analyses within a date range with pagination support
 * @param startDate The start date of the range
 * @param endDate The end date of the range
 * @param page The page number (starting from 1)
 * @param pageSize The number of items per page
 * @returns Object containing daily analyses and pagination metadata
 */
export async function getDailyAnalysesByDateRange(
  startDate: Date, 
  endDate: Date,
  page: number = 1,
  pageSize: number = 10
) {
  try {
    // Ensure valid pagination parameters
    const validPage = Math.max(1, page);
    const validPageSize = Math.max(1, Math.min(100, pageSize)); // Limit max page size to 100
    const skip = (validPage - 1) * validPageSize;

    // Get total count for pagination metadata
    const totalCount = await prisma.dayle.count({
      where: {
        timeStamp: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    // Get paginated results
    const daily = await prisma.dayle.findMany({
      where: {
        timeStamp: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        timeStamp: 'desc',
      },
      skip,
      take: validPageSize,
    });

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / validPageSize);
    const hasNextPage = validPage < totalPages;
    const hasPreviousPage = validPage > 1;

    return {
      data: daily,
      pagination: {
        totalCount,
        totalPages,
        currentPage: validPage,
        pageSize: validPageSize,
        hasNextPage,
        hasPreviousPage,
      },
    };
  } catch (error) {
    console.error('Error retrieving daily analyses by date range:', error);
    throw new Error('Failed to retrieve daily analyses by date range');
  }
}

/**
 * Retrieves the most recent daily analysis
 * @returns The most recent daily analysis or null if none exists
 */
export async function getMostRecentDailyAnalysis() {
  try {
    const daily = await prisma.dayle.findFirst({
      orderBy: {
        timeStamp: 'desc',
      },
    });

    return daily;
  } catch (error) {
    console.error('Error retrieving most recent daily analysis:', error);
    throw new Error('Failed to retrieve most recent daily analysis');
  }
}

/**
 * Retrieves daily analyses with sorting and pagination support
 * @param sortDirection The sort direction ('asc' or 'desc')
 * @param page The page number (starting from 1)
 * @param pageSize The number of items per page
 * @returns Object containing daily analyses and pagination metadata
 */
export async function getDailyAnalyses(
  sortDirection: 'asc' | 'desc' = 'desc',
  page: number = 1,
  pageSize: number = 10
) {
  try {
    // Ensure valid pagination parameters
    const validPage = Math.max(1, page);
    const validPageSize = Math.max(1, Math.min(100, pageSize)); // Limit max page size to 100
    const skip = (validPage - 1) * validPageSize;

    // Get total count for pagination metadata
    const totalCount = await prisma.dayle.count();

    // Get paginated results
    const daily = await prisma.dayle.findMany({
      orderBy: {
        timeStamp: sortDirection,
      },
      skip,
      take: validPageSize,
    });

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / validPageSize);
    const hasNextPage = validPage < totalPages;
    const hasPreviousPage = validPage > 1;

    return {
      data: daily,
      pagination: {
        totalCount,
        totalPages,
        currentPage: validPage,
        pageSize: validPageSize,
        hasNextPage,
        hasPreviousPage,
      },
    };
  } catch (error) {
    console.error('Error retrieving daily analyses:', error);
    throw new Error('Failed to retrieve daily analyses');
  }
}
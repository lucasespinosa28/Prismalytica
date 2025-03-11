import { PrismaClient } from '@prisma/client';

// Use the same Prisma client instance
const prisma = new PrismaClient();

/**
 * Creates a new weekly analysis entry
 * @param message The analysis message content
 * @param prompt The prompt used to generate the analysis
 * @returns The created weekly analysis object
 */
export async function createWeeklyAnalysis(message: string, prompt: string) {
  try {
    const weekly = await prisma.weekly.create({
      data: {
        message,
        prompt,
        // timeStamp is automatically set to now() by default
      },
    });

    return weekly;
  } catch (error) {
    console.error('Error creating weekly analysis:', error);
    throw new Error('Failed to create weekly analysis');
  }
}

/**
 * Retrieves all weekly analysis entries
 * @param limit Optional limit for the number of entries to retrieve
 * @param offset Optional offset for pagination
 * @returns Array of weekly analysis entries
 */
export async function getAllWeeklyAnalyses(limit?: number, offset?: number) {
  try {
    const weekly = await prisma.weekly.findMany({
      orderBy: {
        timeStamp: 'desc', // Most recent first
      },
      ...(limit !== undefined && { take: limit }),
      ...(offset !== undefined && { skip: offset }),
    });

    return weekly;
  } catch (error) {
    console.error('Error retrieving weekly analyses:', error);
    throw new Error('Failed to retrieve weekly analyses');
  }
}

/**
 * Retrieves weekly analyses within a date range with pagination support
 * @param startDate The start date of the range
 * @param endDate The end date of the range
 * @param page The page number (starting from 1)
 * @param pageSize The number of items per page
 * @returns Object containing weekly analyses and pagination metadata
 */
export async function getWeeklyAnalysesByDateRange(
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
    const totalCount = await prisma.weekly.count({
      where: {
        timeStamp: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    // Get paginated results
    const weekly = await prisma.weekly.findMany({
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
      data: weekly,
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
    console.error('Error retrieving weekly analyses by date range:', error);
    throw new Error('Failed to retrieve weekly analyses by date range');
  }
}

/**
 * Retrieves the most recent weekly analysis
 * @returns The most recent weekly analysis or null if none exists
 */
export async function getMostRecentWeeklyAnalysis() {
  try {
    const weekly = await prisma.weekly.findFirst({
      orderBy: {
        timeStamp: 'desc',
      },
    });

    return weekly;
  } catch (error) {
    console.error('Error retrieving most recent weekly analysis:', error);
    throw new Error('Failed to retrieve most recent weekly analysis');
  }
}

/**
 * Retrieves weekly analyses with sorting and pagination support
 * @param sortDirection The sort direction ('asc' or 'desc')
 * @param page The page number (starting from 1)
 * @param pageSize The number of items per page
 * @returns Object containing weekly analyses and pagination metadata
 */
export async function getWeeklyAnalyses(
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
    const totalCount = await prisma.weekly.count();

    // Get paginated results
    const weekly = await prisma.weekly.findMany({
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
      data: weekly,
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
    console.error('Error retrieving weekly analyses:', error);
    throw new Error('Failed to retrieve weekly analyses');
  }
}
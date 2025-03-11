import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

/**
 * Resets the daily credits for all users back to the default value
 * @returns The number of users whose credits were reset
 */
export async function resetAllUserDailyCredits() {
  try {
    const result = await prisma.user.updateMany({
      data: {
        dailyCredit: 10
      }
    });

    return result.count;
  } catch (error) {
    console.error('Error resetting daily credits:', error);
    throw new Error('Failed to reset daily credits');
  }
}

/**
 * Decrements a user's daily credit by the specified amount
 * @param userId The ID of the user
 * @param amount The amount to decrement (default: 1)
 * @returns The updated user object
 */
export async function decrementUserDailyCredit(userId: number, amount: number = 1) {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        dailyCredit: {
          decrement: amount
        }
      }
    });

    return user;
  } catch (error) {
    console.error('Error decrementing user daily credit:', error);
    throw new Error('Failed to update user daily credit');
  }
}

/**
 * Gets the current daily credit for a user
 * @param userId The ID of the user
 * @returns The user's current daily credit
 */
export async function getUserDailyCredit(userId: number) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { dailyCredit: true }
    });

    return user?.dailyCredit ?? 0;
  } catch (error) {
    console.error('Error getting user daily credit:', error);
    throw new Error('Failed to get user daily credit');
  }
}

/**
 * Creates a new user with the provided address and signature
 * @param address The user's blockchain address
 * @param signature The user's signature
 * @returns The created user object
 */
export async function createUser(address: string, signature: string) {
  try {
    const user = await prisma.user.create({
      data: {
        address,
        signature,
      },
    });

    return user;
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error('Failed to create user');
  }
}

/**
 * Retrieves a user's address by their signature
 * @param signature The user's signature
 * @returns The user's address or null if not found
 */
export async function getUserAddressBySignature(signature: string) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        signature,
      },
      select: {
        address: true,
      },
    });

    return user?.address || null;
  } catch (error) {
    console.error('Error retrieving user address:', error);
    throw new Error('Failed to retrieve user address');
  }
}

/**
 * Retrieves a user by their address
 * @param address The user's blockchain address
 * @returns The user object or null if not found
 */
export async function getUserByAddress(address: string) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        address,
      },
    });

    return user;
  } catch (error) {
    console.error('Error retrieving user by address:', error);
    throw new Error('Failed to retrieve user');
  }
}

/**
 * Retrieves a user by their signature
 * @param signature The user's signature
 * @returns The complete user object or null if not found
 */
export async function getUserBySignature(signature: string) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        signature,
      },
    });

    return user;
  } catch (error) {
    console.error('Error retrieving user by signature:', error);
    throw new Error('Failed to retrieve user');
  }
}

/**
 * Checks if a user exists by their address
 * @param address The user's blockchain address
 * @returns Boolean indicating whether the user exists
 */
export async function userExistsByAddress(address: string): Promise<boolean> {
  try {
    const user = await prisma.user.findUnique({
      where: {
        address,
      },
      select: {
        id: true, // Only select the ID field for efficiency
      },
    });
    
    return user !== null;
  } catch (error) {
    console.error('Error checking if user exists:', error);
    throw new Error('Failed to check if user exists');
  }
}

/**
 * Gets the current daily credit for a user by their blockchain address
 * @param address The blockchain address of the user
 * @returns The user's current daily credit or null if user not found
 */
export async function getUserDailyCreditByAddress(address: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { address },
      select: { dailyCredit: true }
    });

    return user ? user.dailyCredit : null;
  } catch (error) {
    console.error('Error getting user daily credit by address:', error);
    throw new Error('Failed to get user daily credit');
  }
}

/**
 * Decrements a user's daily credit by the specified amount using their signature
 * @param signature The signature of the user
 * @param amount The amount to decrement (default: 1)
 * @returns The updated user object or null if user not found
 */
export async function decrementUserDailyCreditBySignature(signature: string, amount: number = 1) {
  try {
    const user = await prisma.user.findUnique({
      where: { signature },
      select: { id: true }
    });

    if (!user) {
      return null;
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        dailyCredit: {
          decrement: amount
        }
      }
    });

    return updatedUser;
  } catch (error) {
    console.error('Error decrementing user daily credit by signature:', error);
    throw new Error('Failed to update user daily credit');
  }
}

/**
 * Gets the total count of users in the database
 * @returns The total number of users
 */
export async function getTotalUserCount() {
  try {
    const count = await prisma.user.count();
    return count;
  } catch (error) {
    console.error('Error counting users:', error);
    throw new Error('Failed to get total user count');
  }
}
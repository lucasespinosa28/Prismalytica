import express from 'express';
import { createUser, getTotalUserCount, getUserDailyCreditByAddress, userExistsByAddress } from '../lib/userDb';

const router = express.Router();

/**
 * GET /user/exists/:address
 * Check if a user exists by their blockchain address
 */
router.get('/exists/:address', async (req: any, res: any) => {
  try {
    const { address } = req.params;

    if (!address) {
      return res.status(400).json({ 
        success: false, 
        message: 'Address parameter is required' 
      });
    }

    const exists = await userExistsByAddress(address);
    return res.status(200).json({
      success: true,
      exists
    });
  } catch (error) {
    console.error('Error checking if user exists:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error while checking user existence' 
    });
  }
});

/**
 * GET /user/dailyCredit/:address
 * Get the remaining daily credit for a user by their blockchain address
 */
router.get('/dailyCredit/:address', async (req: any, res: any) => {
  try {
    const { address } = req.params;

    if (!address) {
      return res.status(400).json({ 
        success: false, 
        message: 'Address parameter is required' 
      });
    }

    const dailyCredit = await getUserDailyCreditByAddress(address);

    if (dailyCredit === null) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    return res.status(200).json({
      success: true,
      dailyCredit
    });
  } catch (error) {
    console.error('Error getting user daily credit:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error while getting user daily credit' 
    });
  }
});

/**
 * POST /user/create
 * Create a new user with address and signature
 * Request body: { address: string, signature: string }
 */
router.post('/create', async (req: any, res: any) => {
  try {
    const countUser = await getTotalUserCount();
    if (countUser >= 50) {
      return res.status(429).json({ 
        success: false, 
        message: 'Too many users registered, maximum limit reached' 
      });
    }
    const { address, signature } = req.body;

    if (!address || !signature) {
      return res.status(400).json({ 
        success: false, 
        message: 'Address and signature are required' 
      });
    }

    // Check if user already exists
    const exists = await userExistsByAddress(address);
    console.log(exists)
    if (exists) {
      return res.status(409).json({ 
        success: false, 
        message: 'User with this address already exists' 
      });
    }

    // Create new user
    const user = await createUser(address, signature);

    return res.status(201).json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error while creating user' 
    });
  }
});

/**
 * GET /user/count
 * Get the total number of users in the system
 */
router.get('/count', async (req: any, res: any) => {
  try {
    const count = await getTotalUserCount();
    
    return res.status(200).json({
      success: true,
      count
    });
  } catch (error) {
    console.error('Error getting user count:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error while getting user count' 
    });
  }
});

export default router;
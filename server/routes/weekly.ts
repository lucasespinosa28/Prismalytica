import express from 'express';
import { getWeeklyAnalyses } from '../lib/weeklyDb';

const router = express.Router();

// GET all weekly entries
router.get('/', async (req, res) => {
  try {
    const entries = await getWeeklyAnalyses('desc', 1, 100);
    res.json(entries);
  } catch (error) {
    console.error('Error fetching weekly entries:', error);
    res.status(500).json({ error: 'Failed to fetch weekly entries' });
  }
});

export default router;
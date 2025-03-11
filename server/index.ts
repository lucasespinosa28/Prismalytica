import express from 'express';
import cors from 'cors';
import weeklyRoutes from './routes/weekly';
import dailyRoutes from './routes/daily';
import userRoutes from './routes/user';
import queryRoutes from './routes/query';
import analysisRoutes from './routes/analysis';
import { initWeeklyAnalysisJob } from './jobs/weeklyAnalysisJob';
import { initDailyCreditResetJob } from './jobs/dailyCreditResetJob.js';
import { initDailyAnalysisJob } from './jobs/dailyAnalysisJob.js';

const app = express();
const port = process.env.PORT || 3000;
// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173','https://prismalytica.pages.dev'], // Allow your frontend origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
    res.send('Hello, Bun with Express and Cron!');
});

// Weekly routes
app.use('/api/weekly', weeklyRoutes);
app.use('/api/daily', dailyRoutes);
app.use('/user', userRoutes);
app.use('/api/query', queryRoutes);
app.use('/api/analysis', analysisRoutes);
// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

// Initialize and start the cron job
initWeeklyAnalysisJob();
initDailyCreditResetJob();
initDailyAnalysisJob();

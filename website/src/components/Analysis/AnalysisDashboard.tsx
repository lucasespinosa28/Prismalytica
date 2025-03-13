import { DailyAnalysis } from './DailyAnalysis';
import { WeeklyAnalysis } from './WeeklyAnalysis';

export const AnalysisDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Crypto Market Analysis</h1>

        <div className="grid grid-cols-1 gap-8">
          <div className="h-full">
            <DailyAnalysis />
          </div>
          <div className="h-full">
            <WeeklyAnalysis />
          </div>
        </div>

        {/* Additional content if needed */}
        <div className="mt-10 bg-gray-800/50 p-6 rounded-lg border border-gray-700">
          <h2 className="text-2xl font-bold mb-4">Analysis Methodology</h2>
          <p className="text-gray-300">
            Our AI-powered analysis combines technical indicators, market sentiment, and on-chain metrics 
            to provide comprehensive insights into cryptocurrency market trends. The analysis is updated 
            daily and weekly to help you make informed trading decisions.
          </p>
        </div>
      </div>
    </div>
  );
};
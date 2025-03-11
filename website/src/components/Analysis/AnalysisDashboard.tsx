import { DailyAnalysis } from './DailyAnalysis';
import { WeeklyAnalysis } from './WeeklyAnalysis';

export const AnalysisDashboard = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">CRO Token Market Analysis</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-full">
          <DailyAnalysis />
        </div>
        <div className="h-full">
          <WeeklyAnalysis />
        </div>
      </div>
    </div>
  );
};
import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

interface AnalysisItem {
  id: number;
  timeStamp: string;
  message: string;
  prompt: string;
}

interface ApiResponse {
  data: AnalysisItem[];
  pagination: {
    totalCount: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export const DailyAnalysis = () => {
  const [analysis, setAnalysis] = useState<AnalysisItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDailyAnalysis = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://server-shy-feather-7870.fly.dev/api/daily');

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data: ApiResponse = await response.json();
        // Only get the first/most recent analysis
        setAnalysis(data.data.length > 0 ? data.data[0] : null);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchDailyAnalysis();
  }, []);

  // Function to format the timestamp
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-gray-800/50 rounded-lg shadow-md p-6 h-full border border-gray-700">
      <h2 className="text-2xl font-bold text-white mb-6">Daily CRO Market Analysis</h2>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
        </div>
      ) : error ? (
        <div className="bg-red-900/30 p-4 rounded-md border border-red-700">
          <p className="text-red-300">Error loading analysis: {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      ) : !analysis ? (
        <p className="text-gray-300 text-center py-8">No analysis data available.</p>
      ) : (
        <div className="border border-gray-600 rounded-lg p-6 bg-gray-700/50">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold text-gray-200">Latest Daily Analysis</h3>
            <span className="text-sm text-gray-400">{formatDate(analysis.timeStamp)}</span>
          </div>

          <div className="prose prose-invert max-w-none text-gray-200">
            <ReactMarkdown components={{
              a: ({ href, children, ...props }) => (
                <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300" {...props}>
                  {children}
                </a>
              ),
            }}>
              {analysis.message}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
};
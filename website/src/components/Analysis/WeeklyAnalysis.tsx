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

export const WeeklyAnalysis = () => {
  const [analyses, setAnalyses] = useState<AnalysisItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    const fetchWeeklyAnalysis = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://server-shy-feather-7870.fly.dev/api/weekly');

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data: ApiResponse = await response.json();
        setAnalyses(data.data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchWeeklyAnalysis();
  }, []);

  // Function to format the timestamp
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Navigation functions
  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? analyses.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === analyses.length - 1 ? 0 : prevIndex + 1
    );
  };
  return (
    <div className="bg-white rounded-lg shadow-md p-6 h-full">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Weekly Market Analysis</h2>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-red-600">Error loading analysis: {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      ) : analyses.length === 0 ? (
        <p className="text-gray-600 text-center py-8">No analysis data available.</p>
      ) : (
        <div className="relative">
          {/* Navigation arrows */}
          <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-4 z-10">
            <button 
              onClick={goToPrevious}
              className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100 focus:outline-none"
              aria-label="Previous analysis"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          </div>

          {/* Current analysis */}
          <div className="border border-gray-200 rounded-lg p-5 mx-8">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-700">Analysis #{analyses[currentIndex].id}</h3>
              <span className="text-sm text-gray-500">{formatDate(analyses[currentIndex].timeStamp)}</span>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-600 mb-1">Analysis:</h4>
              <div className="prose max-w-none text-gray-800 max-h-[400px] overflow-y-auto pr-2">
                <ReactMarkdown components={{
                  a: ({ href, children, ...props }) => (
                    <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
                      {children}
                    </a>
                  ),
                }}>
                  {analyses[currentIndex].message}
                </ReactMarkdown>
              </div>
            </div>
          </div>

          <div className="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-4 z-10">
            <button 
              onClick={goToNext}
              className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100 focus:outline-none"
              aria-label="Next analysis"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Pagination indicator */}
          <div className="flex justify-center mt-4 space-x-2">
            {analyses.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 w-2 rounded-full ${
                  index === currentIndex ? 'bg-blue-600' : 'bg-gray-300'
                }`}
                aria-label={`Go to analysis ${index + 1}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
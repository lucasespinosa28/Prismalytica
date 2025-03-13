import React, { useState, useEffect } from 'react';

interface DailyCreditProps {
  address: `0x${string}`;
  refreshTrigger?: number; // A value that changes to trigger a refresh
}

const DailyCredit: React.FC<DailyCreditProps> = ({ address, refreshTrigger }) => {
  const [creditInfo, setCreditInfo] = useState<{ used: number; total: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCreditInfo = async () => {
      if (!address) return;
      try {
        setLoading(true);
        const response = await fetch(`https://server-shy-feather-7870.fly.dev/user/dailyCredit/${address}`);

        if (!response.ok) throw new Error(`Failed to fetch credit info: ${response.statusText}`);

        const data = await response.json();
        setCreditInfo({ used: data.dailyCredit, total: 10 });
        setError(null);
      } catch (err) {
        console.error('Error fetching daily credit info:', err);
        setError('Failed to load credit information');
        setCreditInfo(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCreditInfo();
  }, [address, refreshTrigger]);

  // Render compact loading state
  if (loading) {
    return (
      <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm flex items-center justify-center gap-2 text-sm text-gray-500">
        <div className="animate-spin h-3 w-3 border-2 border-blue-500 border-t-transparent rounded-full"></div>
        <span>Loading...</span>
      </div>
    );
  }

  // Render compact error state
  if (error) {
    return (
      <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm text-xs text-red-500 flex items-center gap-1">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        <span>Error loading credits</span>
      </div>
    );
  }

  // Render compact no data state
  if (!creditInfo) {
    return (
      <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm text-xs text-gray-500">
        No credit data
      </div>
    );
  }

  // Calculate remaining credits and percentages
  const remaining = creditInfo.total - creditInfo.used;
  const remainingPercentage = Math.max(0, Math.min(100, (remaining / creditInfo.total) * 100));

  // Determine color based on remaining percentage
  const barColor = remainingPercentage > 9 ? 'bg-green-500' : 
                  remainingPercentage > 3 ? 'bg-yellow-500' : 'bg-red-500';
  return (
    <div className="p-3 bg-white dark:bg-gray-800 shadow-sm">
      <div className="flex justify-between items-center text-xs mb-1.5">
        <span className="font-medium text-gray-700 dark:text-gray-300">Daily Credits</span>
        <span className="text-gray-500">{remaining}/{creditInfo.total}</span>
      </div>
      <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${barColor}`} style={{ width: `${remainingPercentage}%` }}></div>
      </div>
    </div>
  );
};

export default DailyCredit;
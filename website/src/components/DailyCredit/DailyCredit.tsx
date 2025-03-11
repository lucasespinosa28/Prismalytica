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
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3000/user/dailyCredit/${address}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch credit info: ${response.statusText}`);
        }

        const data = await response.json();
        console.log(data)
        setCreditInfo({ used: data.dailyCredit, total:10  });
        setError(null);
      } catch (err) {
        console.error('Error fetching daily credit info:', err);
        setError('Failed to load credit information');
        setCreditInfo(null);
      } finally {
        setLoading(false);
      }
    };

    if (address) {
      fetchCreditInfo();
    }
  }, [address, refreshTrigger]); // Add refreshTrigger to the dependency array

  if (loading) {
    return <div className="p-4 bg-white rounded-lg shadow-sm text-center text-gray-500">Loading credit info...</div>;
  }

  if (error) {
    return <div className="p-4 bg-white rounded-lg shadow-sm text-red-500">{error}</div>;
  }

  if (!creditInfo) {
    return <div className="p-4 bg-white rounded-lg shadow-sm text-gray-500">No credit information available</div>;
  }

  const usagePercentage = (creditInfo.used / creditInfo.total) * 100;

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <h3 className="text-lg font-medium text-gray-700 mb-2">Daily Credits</h3>
      <div className="space-y-2">
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full ${
              usagePercentage > 80 ? 'bg-green-500' : 
              usagePercentage > 50 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${usagePercentage}%` }}
          ></div>
        </div>
        <div className="text-sm text-gray-600 text-right">
          {creditInfo.used} / {creditInfo.total} used
        </div>
      </div>
    </div>
  );
};

export default DailyCredit;
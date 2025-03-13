import React, { useState, useEffect } from 'react';

interface UserCountProps {
  refreshTrigger?: number; // A value that changes to trigger a refresh
}

const UserCount: React.FC<UserCountProps> = ({ refreshTrigger }) => {
  const [userCount, setUserCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://server-shy-feather-7870.fly.dev/user/count`);

        if (!response.ok) {
          throw new Error(`Failed to fetch user count: ${response.statusText}`);
        }

        const data = await response.json();
        setUserCount(data.count);
        setError(null);
      } catch (err) {
        console.error('Error fetching user count:', err);
        setError('Failed to load user count information');
        setUserCount(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserCount();
  }, [refreshTrigger]); // Only depends on refreshTrigger since we don't need address for this endpoint

  if (loading) {
    return <div className="p-3 bg-gray-800/50 border border-gray-700 rounded-lg text-center text-blue-400 shadow-md">Loading user count...</div>;
  }

  if (error) {
    return <div className="p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-300 shadow-md">{error}</div>;
  }

  if (userCount === null) {
    return <div className="p-3 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-400 shadow-md">No user count information available</div>;
  }

  return (
    <div className="p-4 bg-gray-800/70 border border-gray-700 rounded-lg flex items-center shadow-lg">
      <div className="mr-3 text-blue-400">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
      </div>
      <div className="flex-1">
        <span className="font-medium text-white">Total Users:</span> 
        <span className="text-blue-300 font-bold ml-1">{userCount}</span> 
        <span className="text-gray-300"> registered users</span>
        <span className="text-xs text-blue-400 ml-2">(Maximum capacity: 50)</span>
      </div>
    </div>
  );
};

export default UserCount;
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
         const response = await fetch(`https://server-shy-feather-7870.fly.dev/user/count`, {
            credentials: 'include',
            headers: {
              'Accept': 'application/json',
              'Origin': window.location.origin
            }
          });
  

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
    return <div className="p-3 bg-blue-50 border border-blue-200 rounded-md text-center text-blue-600">Loading user count...</div>;
  }

  if (error) {
    return <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600">{error}</div>;
  }

  if (userCount === null) {
    return <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-gray-600">No user count information available</div>;
  }

  return (
    <div className="p-3 bg-blue-50 border border-blue-200 rounded-md flex items-center">
      <div className="mr-2 text-blue-500">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
      </div>
      <div className="flex-1">
        <span className="font-medium">Total Users:</span> {userCount} registered users 
        <span className="text-xs text-blue-600 ml-1">(Maximum capacity: 50)</span>
      </div>
    </div>
  );
};

export default UserCount;
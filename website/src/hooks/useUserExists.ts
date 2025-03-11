import { useEffect, useState } from 'react';

interface UserExistsResponse {
  success: boolean;
  exists: boolean;
}

export const useUserExists = (address: string | undefined) => {
  const [userExists, setUserExists] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const checkUserExists = async () => {
      if (!address) {
        setUserExists(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`http://localhost:3000/user/exists/${address}`);
        const data: UserExistsResponse = await response.json();
        if (data.success) {
          setUserExists(data.exists);
        } else {
          throw new Error('Failed to check if user exists');
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
        setUserExists(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserExists();
  }, [address]);

  return { userExists, isLoading, error };
};
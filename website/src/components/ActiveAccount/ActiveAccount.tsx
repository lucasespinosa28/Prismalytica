import React, { useState, useEffect, useRef } from 'react';
import { useSignMessage } from 'wagmi';

interface ActiveAccountProps {
  address: `0x${string}`| undefined;
  onActivationSuccess: () => void;
}

const ActiveAccount: React.FC<ActiveAccountProps> = ({ address, onActivationSuccess }) => {
  const [isActivating, setIsActivating] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const { signMessage, data: signature, status } = useSignMessage();
  const userCreationAttempted = useRef(false);

  const isSigningMessage = status === 'pending';

  // Effect to handle successful signature and create user
  useEffect(() => {
    const createUser = async () => {
      // Check if we've already attempted to create the user with this signature
      if (status === 'success' && signature && !userCreationAttempted.current) {
        // Set the flag to prevent duplicate calls
        userCreationAttempted.current = true;
        try {
          setApiError(null);

          const response = await fetch('https://server-shy-feather-7870.fly.dev/user/create', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              address,
              signature
            }),
          });
          console.log(response)
          const data = await response.json();

          if (response.ok && data.success) {
            // User created successfully
            onActivationSuccess();

            // Add a small delay before reloading to ensure the success callback completes
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          } else {
            // API returned an error
            setApiError(data.message || 'Failed to create user account');
            // Reset the flag if there was an error, so the user can try again
            userCreationAttempted.current = false;
          }
        } catch (error) {
          console.error('Error creating user:', error);
          setApiError('Network error. Please try again.');
          // Reset the flag if there was an error, so the user can try again
          userCreationAttempted.current = false;
        } finally {
          setIsActivating(false);
        }
      }
    };

    createUser();
  }, [signature, status, address, onActivationSuccess]);

  const handleActivateAccount = async () => {
    try {
      setIsActivating(true);
      setApiError(null);
      // Reset the flag when starting a new activation attempt
      userCreationAttempted.current = false;

      // Create a message to sign
      const message = `I confirm that I own the wallet address ${address}.`;

      // Request signature
      await signMessage({ message });

      // The useEffect will handle the API call after successful signature
    } catch (error) {
      console.error('Account activation failed:', error);
      setIsActivating(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] px-4 py-12 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl shadow-2xl p-8 max-w-md w-full backdrop-blur-sm">
        <div className="flex items-center justify-center mb-6">
          <div className="h-16 w-16 bg-blue-500/20 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 100-12 6 6 0 000 12zm-1-5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zm0-4a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white text-center mb-2">Account Activation</h2>
        <p className="text-gray-300 text-center mb-8">Verify your wallet to access premium features</p>

        <div className="bg-gray-700/50 border border-gray-600 p-4 rounded-lg mb-6">
          <span className="block text-sm font-medium text-gray-300 mb-1">Connected Wallet:</span>
          <code className="block text-sm bg-gray-800/70 text-blue-300 p-3 rounded-md overflow-auto break-all border border-gray-600">{address}</code>
        </div>

        {status === "error" && (
          <div className="bg-red-900/30 text-red-300 p-4 rounded-lg mb-6 border border-red-700 flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>Error signing message. Please try again.</span>
          </div>
        )}

        {apiError && (
          <div className="bg-red-900/30 text-red-300 p-4 rounded-lg mb-6 border border-red-700 flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>{apiError}</span>
          </div>
        )}

        {status === "success" && !apiError && (
          <div className="bg-green-900/30 text-green-300 p-4 rounded-lg mb-6 border border-green-700 flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Signature successful! Activating your account...</span>
          </div>
        )}
        <button 
          className={`w-full py-3.5 px-4 rounded-lg font-medium text-white transition-all duration-200 flex items-center justify-center ${
            isActivating || isSigningMessage 
              ? 'bg-blue-600/50 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-500 shadow-lg hover:shadow-blue-500/30'
          }`}
          onClick={handleActivateAccount}
          disabled={isActivating || isSigningMessage}
        >
          {isActivating || isSigningMessage ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Activating...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
              Activate Account
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ActiveAccount;
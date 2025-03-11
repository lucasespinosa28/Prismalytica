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

          const response = await fetch('http://localhost:3000/user/create', {
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
    <div className="p-8 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Account Activation Required</h2>
        <p className="text-gray-600 mb-6">Your wallet address needs to be activated to access the Technical Analyst features.</p>

        <div className="bg-gray-50 p-4 rounded-md mb-6">
          <span className="block text-sm font-medium text-gray-700 mb-1">Wallet Address:</span>
          <code className="block text-sm bg-gray-100 p-2 rounded overflow-auto break-all">{address}</code>
        </div>

        {status === "error" && <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">Error signing message. Please try again.</div>}
        {apiError && <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">{apiError}</div>}
        {status === "success" && !apiError && <div className="bg-green-50 text-green-600 p-3 rounded-md mb-4">Signature successful! Activating your account...</div>}

        <button 
          className={`w-full py-3 px-4 rounded-md font-medium text-white transition-colors ${
            isActivating || isSigningMessage 
              ? 'bg-blue-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
          onClick={handleActivateAccount}
          disabled={isActivating || isSigningMessage}
        >
          {isActivating || isSigningMessage ? 'Activating...' : 'Activate Account'}
        </button>

        <div className="mt-6 space-y-4 text-sm text-gray-500">
          <p>
            By activating your account, you'll gain access to AI-powered technical analysis 
            and trading insights.
          </p>
          <p className="italic">
            You'll be asked to sign a message to verify ownership of your wallet address.
            This is a secure process and doesn't require any gas fees.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ActiveAccount;
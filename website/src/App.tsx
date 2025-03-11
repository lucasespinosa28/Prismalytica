import './App.css'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import ChatInterface from './components/ChatInterface/ChatInterface'
import { useUserExists } from './hooks/useUserExists'
import ActiveAccount from './components/ActiveAccount/ActiveAccount'
import { useState, useEffect } from 'react'
import { AnalysisDashboard } from './components/Analysis/AnalysisDashboard'
import UserCount from './components/UserCount/UserCount'

function App() {
  const account = useAccount()
  const { userExists, isLoading, error } = useUserExists(account.address)
  const [refreshUserCheck, setRefreshUserCheck] = useState(0)
  // Function to trigger a refresh of the user existence check
  const handleActivationSuccess = () => {
    setRefreshUserCheck(prev => prev + 1)
  }

  // Re-run the user exists check when refreshUserCheck changes
  useEffect(() => {
    // The useUserExists hook will re-run when account.address changes,
    // but we also want to trigger it manually after activation
  }, [refreshUserCheck])
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <UserCount />
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Prismalytica Technical Analyst</h1>
            <p className="mt-2 text-lg text-gray-600">
              Advanced crypto market analysis powered by AI. Get real-time insights, chart patterns, and trading signals.
            </p>
          </div>
        </div>

        {/* Conditionally render ChatInterface above AnalysisDashboard if user exists */}
        {account.address && userExists === true && (
          <ChatInterface address={account.address} />
        )}
      

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {!account.address ? (
            <div className="p-8 text-center">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Welcome to Technical Analyst</h2>
              <p className="text-gray-600 mb-6">Please connect your wallet to crate custom Analyst</p>
              <div className="flex justify-center">
                <ConnectButton />
              </div>
            </div>
          ) : isLoading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600 mb-4"></div>
              <p className="text-gray-600">Checking user access...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center bg-red-50">
              <p className="text-red-600 mb-4">Error checking user status: {error.message}</p>
              <button 
                onClick={() => setRefreshUserCheck(prev => prev + 1)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Retry
              </button>
            </div>
         ) : userExists === true ? (
          <div>
            {/* Empty div since ChatInterface is now rendered above */}
          </div>
        ) : (
          <ActiveAccount 
            address={account.address} 
            onActivationSuccess={handleActivationSuccess} 
          />
        )}
        </div>
        <AnalysisDashboard/>
      </div>
    </div>
  )
}

export default App

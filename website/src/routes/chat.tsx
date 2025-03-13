import { ConnectButton } from '@rainbow-me/rainbowkit'
import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import ActiveAccount from '../components/ActiveAccount/ActiveAccount'
import ChatInterface from '../components/ChatInterface/ChatInterface'
import UserCount from '../components/UserCount/UserCount'
import { useUserExists } from '../hooks/useUserExists'

export const Route = createFileRoute('/chat')({
  component: RouteComponent,
})

function RouteComponent() {
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
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <UserCount />
        </div>

        <header className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Prismalytica Technical Analyst</h1>
          <p className="text-xl max-w-3xl mx-auto text-gray-300">
            Advanced crypto market analysis powered by AI. Get real-time insights, chart patterns, and trading signals.
          </p>
        </header>

        {/* Conditionally render ChatInterface above AnalysisDashboard if user exists */}
        {account.address && userExists === true && (
          <div className="max-w-4xl mx-auto mb-10">
            <ChatInterface address={account.address} />
          </div>
        )}

        <div className="max-w-4xl mx-auto bg-gray-800/50 p-6 rounded-lg border border-gray-700">
          {!account.address ? (
            <div className="p-8 text-center">
              <h2 className="text-2xl font-semibold mb-4">Welcome to Technical Analyst</h2>
              <p className="text-gray-300 mb-6">Please connect your wallet to create custom Analyst</p>
              <div className="flex justify-center">
                <ConnectButton />
              </div>
            </div>
          ) : isLoading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-400 mb-4"></div>
              <p className="text-gray-300">Checking user access...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center bg-red-900/30 rounded-lg border border-red-700">
              <p className="text-red-300 mb-4">Error checking user status: {error.message}</p>
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

        {/* Features Section */}
        {!account.address && (
          <section className="container mx-auto px-4 py-10 mt-10">
            <h2 className="text-2xl font-bold text-center mb-8">Chat Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: "Real-time Analysis",
                  description: "Get instant technical analysis on any cryptocurrency with current market data."
                },
                {
                  title: "Trading Insights",
                  description: "Receive actionable trading insights based on current market conditions."
                },
                {
                  title: "Educational Support",
                  description: "Learn about trading concepts, indicators, and strategies through conversation."
                }
              ].map((feature, index) => (
                <div key={index} className="bg-gray-800/50 p-5 rounded-lg border border-gray-700 hover:border-blue-500 transition-colors">
                  <h3 className="text-xl font-semibold mb-3 text-blue-400">{feature.title}</h3>
                  <p className="text-gray-300">{feature.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

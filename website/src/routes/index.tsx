import { createFileRoute } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Hero Section */}
      <header className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-4">Prismalytica</h1>
        <h2 className="text-2xl md:text-3xl text-blue-400 font-semibold mb-8">Crypto Technical Analyst AI Agent</h2>
        <p className="text-xl max-w-3xl mx-auto mb-10 text-gray-300">
          Advanced AI-powered cryptocurrency market analysis, delivering actionable insights through natural language processing.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/analysis" className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors">
            View Analysis
          </Link>
          <Link to="/chat" className="px-8 py-3 border border-blue-500 hover:bg-blue-900/30 rounded-lg font-medium transition-colors">
            Chat with AI
          </Link>
        </div>
      </header>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Unique Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: "AI-Powered Analysis",
              description: "Utilizes advanced AI models to perform technical analysis, offering insights beyond traditional analytical methods."
            },
            {
              title: "Real-Time Data Processing",
              description: "Connects to live market data sources for up-to-date analysis across multiple exchanges."
            },
            {
              title: "Customizable Queries",
              description: "Input specific questions or parameters to receive tailored analytical responses for your trading strategy."
            },
            {
              title: "Integration with Cronos Ecosystem",
              description: "Leverages the robust infrastructure and data from Crypto.com's platform for reliable insights."
            },
            {
              title: "Self-Hosted Solution",
              description: "Offers the flexibility and security of running the AI agent on your own server."
            },
            {
              title: "User-Friendly Interface",
              description: "Provides an intuitive frontend for easy interaction with the AI agent, making advanced trading strategies accessible."
            }
          ].map((feature, index) => (
            <div key={index} className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 hover:border-blue-500 transition-colors">
              <h3 className="text-xl font-semibold mb-3 text-blue-400">{feature.title}</h3>
              <p className="text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Analysis Types Section
      <section className="container mx-auto px-4 py-16 bg-gray-800/30">
        <h2 className="text-3xl font-bold text-center mb-12">Comprehensive Analysis</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h3 className="text-2xl font-semibold mb-4 text-center">Daily Analysis</h3>
            <p className="text-gray-300 mb-4">
              Get detailed daily reports on major cryptocurrencies including support/resistance levels, 
              trend analysis, and momentum indicators.
            </p>
            <Link to="/analysis/daily" className="block text-center py-2 text-blue-400 hover:text-blue-300">
              View Daily Reports →
            </Link>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h3 className="text-2xl font-semibold mb-4 text-center">Weekly Analysis</h3>
            <p className="text-gray-300 mb-4">
              Access comprehensive weekly market overviews with volatility assessments, 
              on-chain metrics, and longer-term trend forecasts.
            </p>
            <Link to="/analysis/weekly" className="block text-center py-2 text-blue-400 hover:text-blue-300">
              View Weekly Reports →
            </Link>
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-3xl mx-auto bg-gradient-to-r from-blue-900/50 to-purple-900/50 p-8 rounded-lg">
          <h2 className="text-3xl font-bold mb-4">Ready to enhance your trading strategy?</h2>
          <p className="text-xl mb-8 text-gray-300">
            Start using Prismalytica today and gain access to AI-powered insights that can transform your approach to cryptocurrency trading.
          </p>
          <Link to="/chat" className="inline-block px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors">
            Get Started Now
          </Link>
        </div>
      </section>
    </div>
  )
}
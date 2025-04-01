const Logo = () => <div className="text-2xl font-bold">Prismalytica</div>
function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row bg-gray max-w-7xl mx-auto">
        <div className="w-full md:w-1/2 p-10">
          <h1 className="text-3xl font-bold mb-4">What is Prismalytica</h1>
          <p className="text-sm mb-6">
            Prismalytica is a Telegram bot that helps users analyze on-chain cryptocurrency data on the Cronos blockchain. It provides insights by fetching OHLCV (Open, High, Low, Close, Volume) data, generating candlestick charts, and answering user queries about the data.
          </p>
          <div className="flex space-x-3">
            <a
              href="https://t.me/PrismalyticaBot"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-gray-900 px-8 py-4 text-xl rounded-lg hover:bg-gray-200 transition duration-300"
            >
              Open Telegram Bot
            </a>
          </div>
        </div>
        <div className="w-full md:w-1/2 flex justify-center items-center">
          <div className="bg-gray-400 flex items-center justify-center">
            <img src="mascot.png" alt="Mascot" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* Analysis Steps Section */}
      <section className="py-10 max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mt-1">Example Analysis</h2>
          <p className="text-sm mt-1">Follow these steps to perform an analysis:</p>
        </div>

        {/* Step 1 */}
        <div className="flex flex-col md:flex-row mb-6">
          <div className="w-full md:w-1/2 bg-gray-800 p-8">
            <h3 className="text-xl font-bold mt-1">Step-by-Step Analysis Instructions</h3>
            <p className="text-sm mt-4">Begin by starting the bot with the command "/start". Then, provide your analysis parameters using "/analysis".</p>
          </div>
          <div className="w-full md:w-1/2 bg-gray-300 flex items-center justify-center">
            <img src="1743366175711.jpg" alt="" srcSet="" />
          </div>
        </div>

        {/* Step 2 */}
        <div className="flex flex-col md:flex-row mb-6">
          <div className="w-full md:w-1/2 bg-gray-300 flex items-center justify-center">
            <img src="1743366175705.jpg" alt="" srcSet="" />
          </div>
          <div className="w-full md:w-1/2 bg-gray-800 p-8">
            <h3 className="text-xl font-bold mt-1">Click in analysis</h3>
            <p className="text-sm mt-4">Type <strong>/analysis</strong> to begin the analysis process.
              Provide the required parameters in the format: <code>pool timeframe aggregate limit</code>.</p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 bg-gray-800 p-8">
            <p className="text-sm mt-4">The bot will fetch the data and generate a candlestick chart for you.</p>
          </div>
          <div className="w-full md:w-1/2 bg-gray-300 flex items-center justify-center">
            <img src="1743366175699.jpg" alt="" srcSet="" />
          </div>
        </div>

        {/* Step 4 */}
        <div className="flex flex-col md:flex-row mt-7 mb-6">
          <div className="w-full md:w-1/2 bg-gray-300 flex items-center justify-center">
            <img src="1743366175690.jpg" alt="" srcSet="" />
          </div>
          <div className="w-full md:w-1/2 bg-gray-800 p-8">
            <p className="text-sm mt-4">Ask follow-up questions about the data  </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-auto">
        <div className="flex flex-col items-center mb-6">
          <span className="text-xl font-bold italic mb-4"><Logo /></span>
          <div className="flex gap-4">
              <a 
                href="https://github.com/your-repo/prismalytica" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                GitHub
              </a>
              <a 
                href="https://t.me/PrismalyticaBot" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                Telegram
              </a>
              <a 
                href="https://twitter.com/prismalytica_ai" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                Twitter
              </a>
            </div>
        </div>

        <div className="border-t border-gray-800 pt-4 flex justify-center">
          <div className="flex flex-col items-center">
            <p className="text-xs text-gray-400 mb-2">© 2025 Prismalytics. All rights reserved</p>
            <div className="flex space-x-4">
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

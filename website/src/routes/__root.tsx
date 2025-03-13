import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

export const Route = createRootRoute({
  component: () => (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header/Navigation */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-xl font-bold text-blue-600 dark:text-blue-400">
              Prismalytica
            </Link>
            <nav className="flex gap-6">
              <Link 
                to="/" 
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 [&.active]:text-blue-600 [&.active]:font-medium transition-colors"
                activeProps={{ className: 'active' }}
              >
                Home
              </Link>
              <Link 
                to="/analysis" 
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 [&.active]:text-blue-600 [&.active]:font-medium transition-colors"
                activeProps={{ className: 'active' }}
              >
                Analysis
              </Link>
              <Link 
                to="/chat" 
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 [&.active]:text-blue-600 [&.active]:font-medium transition-colors"
                activeProps={{ className: 'active' }}
              >
                Chat
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-6">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                © {new Date().getFullYear()} Prismalytica. All rights reserved.
              </p>
            </div>
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
                href="https://prismalytica.pages.dev/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                Website
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
        </div>
      </footer>

      {/* Router Devtools - only in development */}
      <TanStackRouterDevtools />
    </div>
  ),
})
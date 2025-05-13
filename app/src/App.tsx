import { createConfig, Config } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RainbowKitProvider, ConnectButton } from '@rainbow-me/rainbowkit'
import { hardhat } from 'viem/chains'
import { http } from 'viem'
import '@rainbow-me/rainbowkit/styles.css'
import { useState, Suspense } from 'react'
import { ErrorBoundary, FallbackProps } from 'react-error-boundary'

// Components
import Dashboard from './pages/Dashboard'
import Voting from './pages/Voting'
import Treasury from './pages/Treasury'

const queryClient = new QueryClient()

const config = createConfig({
  chains: [hardhat],
  transports: {
    [hardhat.id]: http()
  }
})

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-xl">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
        <pre className="text-sm text-gray-500 mb-4">{error.message}</pre>
        <button
          onClick={resetErrorBoundary}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Try again
        </button>
      </div>
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  )
}

type Page = 'dashboard' | 'voting' | 'treasury'

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard')

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />
      case 'voting':
        return <Voting />
      case 'treasury':
        return <Treasury />
      default:
        return <Dashboard />
    }
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow-lg">
              <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between h-16">
                  <div className="flex">
                    <div className="flex-shrink-0 flex items-center">
                      <h1 className="text-xl font-bold text-indigo-600">Dr.DAO</h1>
                    </div>
                    <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                      {(['dashboard', 'voting', 'treasury'] as const).map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`${
                            currentPage === page
                              ? 'border-indigo-500 text-gray-900'
                              : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                          } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium capitalize`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <ConnectButton />
                  </div>
                </div>
                
                {/* Mobile Navigation */}
                <div className="sm:hidden">
                  <div className="pt-2 pb-3 space-y-1">
                    {(['dashboard', 'voting', 'treasury'] as const).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`${
                          currentPage === page
                            ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                            : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                        } block pl-3 pr-4 py-2 border-l-4 text-base font-medium capitalize w-full text-left`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </nav>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
              <Suspense fallback={<LoadingFallback />}>
                {renderPage()}
              </Suspense>
            </main>
          </div>
        </RainbowKitProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default App 
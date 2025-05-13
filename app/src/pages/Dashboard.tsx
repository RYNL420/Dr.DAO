import { useAccount } from 'wagmi'

export default function Dashboard() {
  const { address, isConnecting, isDisconnected } = useAccount()

  if (isConnecting) return <div>Connecting...</div>
  if (isDisconnected) return <div>Connect your wallet to view the dashboard</div>

  return (
    <div className="space-y-6">
      <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <h2 className="text-lg font-medium text-gray-900">Treasury Overview</h2>
        <div className="mt-4">
          <div className="text-center text-gray-500 py-8">
            No recent activity
          </div>
        </div>
      </div>

      <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <h2 className="text-lg font-medium text-gray-900">AI Recommendations</h2>
        <div className="mt-4">
          <div className="text-center text-gray-500 py-8">
            No recommendations available
          </div>
        </div>
      </div>

      <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <h2 className="text-lg font-medium text-gray-900">Recent Transactions</h2>
        <div className="mt-4">
          <div className="text-center text-gray-500 py-8">
            No recent transactions
          </div>
        </div>
      </div>
    </div>
  )
} 
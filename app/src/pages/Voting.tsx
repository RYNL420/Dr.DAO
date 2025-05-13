import { useAccount } from 'wagmi'

export default function Voting() {
  const { address, isConnecting, isDisconnected } = useAccount()

  if (isConnecting) return <div>Connecting...</div>
  if (isDisconnected) return <div>Connect your wallet to participate in voting</div>

  return (
    <div className="space-y-6">
      <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Active Polls
            </h2>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create New Poll
            </button>
          </div>
        </div>

        <div className="mt-8">
          <div className="text-center text-gray-500 py-8">
            No active polls
          </div>
        </div>
      </div>

      <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <h2 className="text-lg font-medium text-gray-900">Past Polls</h2>
        <div className="mt-4">
          <div className="text-center text-gray-500 py-8">
            No past polls
          </div>
        </div>
      </div>
    </div>
  )
} 
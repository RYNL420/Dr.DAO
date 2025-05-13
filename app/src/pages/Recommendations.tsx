import { useQuery } from 'react-query';
import { useAccount } from 'wagmi';
import axios from 'axios';

interface Recommendation {
  recommendation: string;
  rationale: string;
  action: {
    protocol: string;
    asset: string;
    amount: string;
    duration: string;
  };
  timestamp: number;
  status: 'pending' | 'approved' | 'rejected';
}

export default function Recommendations() {
  const { address } = useAccount();

  const { data: recommendations, isLoading } = useQuery<Recommendation[]>(
    'recommendations',
    async () => {
      const response = await axios.get('/api/recommendations');
      return response.data;
    }
  );

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Latest Recommendations</h2>
        <div className="space-y-6">
          {recommendations?.map((rec, index) => (
            <div
              key={index}
              className="border rounded-lg p-6 space-y-4 bg-gradient-to-r from-indigo-50 to-white"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <h3 className="text-xl font-medium text-gray-900">
                    {rec.recommendation}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {new Date(rec.timestamp).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    rec.status === 'approved'
                      ? 'bg-green-100 text-green-800'
                      : rec.status === 'rejected'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {rec.status.charAt(0).toUpperCase() + rec.status.slice(1)}
                </span>
              </div>

              <div className="bg-white rounded-lg p-4 border border-gray-100">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Rationale</h4>
                <p className="text-sm text-gray-600">{rec.rationale}</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Protocol</p>
                  <p className="text-sm font-medium text-gray-900">{rec.action.protocol}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Asset</p>
                  <p className="text-sm font-medium text-gray-900">{rec.action.asset}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Amount</p>
                  <p className="text-sm font-medium text-gray-900">{rec.action.amount}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Duration</p>
                  <p className="text-sm font-medium text-gray-900">{rec.action.duration}</p>
                </div>
              </div>

              {rec.status === 'pending' && (
                <div className="flex space-x-4">
                  <button
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={() => {
                      // Create futarchy poll
                    }}
                  >
                    Create Futarchy Poll
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 
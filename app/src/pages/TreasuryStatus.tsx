import { useQuery } from 'react-query';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

interface TreasuryAsset {
  symbol: string;
  amount: number;
  value: number;
  allocation: number;
  protocol: string;
  apy: number;
}

interface TreasuryStatus {
  totalValue: number;
  assets: TreasuryAsset[];
  performanceMetrics: {
    dailyReturn: number;
    weeklyReturn: number;
    monthlyReturn: number;
    yearlyReturn: number;
    riskAdjustedReturn: number;
    diversificationScore: number;
  };
}

export default function TreasuryStatus() {
  const { data: treasuryStatus, isLoading } = useQuery<TreasuryStatus>(
    'treasuryStatus',
    async () => {
      const response = await axios.get('/api/treasury/status');
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
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Treasury Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-indigo-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-indigo-900">Total Value</h3>
            <p className="text-3xl font-bold text-indigo-600">
              ${treasuryStatus?.totalValue.toLocaleString()}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-green-900">Annual Return</h3>
            <p className="text-3xl font-bold text-green-600">
              {treasuryStatus?.performanceMetrics.yearlyReturn.toFixed(2)}%
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-purple-900">Risk Score</h3>
            <p className="text-3xl font-bold text-purple-600">
              {treasuryStatus?.performanceMetrics.riskAdjustedReturn.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Asset Allocation</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Asset
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Protocol
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Value
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  APY
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {treasuryStatus?.assets.map((asset, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {asset.symbol}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {asset.protocol}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {asset.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${asset.value.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {asset.apy.toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Performance Metrics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-500">Daily Return</p>
            <p className="text-sm font-medium text-gray-900">
              {treasuryStatus?.performanceMetrics.dailyReturn.toFixed(2)}%
            </p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-500">Weekly Return</p>
            <p className="text-sm font-medium text-gray-900">
              {treasuryStatus?.performanceMetrics.weeklyReturn.toFixed(2)}%
            </p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-500">Monthly Return</p>
            <p className="text-sm font-medium text-gray-900">
              {treasuryStatus?.performanceMetrics.monthlyReturn.toFixed(2)}%
            </p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-500">Diversification Score</p>
            <p className="text-sm font-medium text-gray-900">
              {treasuryStatus?.performanceMetrics.diversificationScore.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 
import { useState } from 'react';
import { useQuery, useMutation } from 'react-query';
import { useAccount } from 'wagmi';
import axios from 'axios';

interface Poll {
  id: string;
  action: string;
  startTime: number;
  endTime: number;
  yesMarketPrice: number;
  noMarketPrice: number;
  resolved: boolean;
  outcome: boolean;
}

export default function FutarchyPolls() {
  const { address } = useAccount();
  const [voteAmount, setVoteAmount] = useState<string>('');
  const [selectedPoll, setSelectedPoll] = useState<string | null>(null);

  const { data: polls, isLoading } = useQuery<Poll[]>(
    'futarchyPolls',
    async () => {
      const response = await axios.get('/api/futarchy/polls');
      return response.data;
    }
  );

  const castVoteMutation = useMutation(
    async ({ pollId, prediction, amount }: { pollId: string; prediction: boolean; amount: string }) => {
      await axios.post('/api/futarchy/vote', {
        pollId,
        prediction,
        amount,
        voter: address,
      });
    }
  );

  const handleVote = async (pollId: string, prediction: boolean) => {
    if (!voteAmount) return;
    
    try {
      await castVoteMutation.mutateAsync({
        pollId,
        prediction,
        amount: voteAmount,
      });
      setVoteAmount('');
      setSelectedPoll(null);
    } catch (error) {
      console.error('Failed to cast vote:', error);
    }
  };

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
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Active Futarchy Polls</h2>
        <div className="space-y-4">
          {polls?.filter(poll => !poll.resolved).map((poll) => (
            <div key={poll.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{poll.action}</h3>
                  <p className="text-sm text-gray-500">
                    Ends in {Math.floor((poll.endTime - Date.now() / 1000) / 3600)} hours
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">Market Prices</p>
                  <p className="text-sm text-green-600">Yes: {(poll.yesMarketPrice * 100).toFixed(2)}%</p>
                  <p className="text-sm text-red-600">No: {(poll.noMarketPrice * 100).toFixed(2)}%</p>
                </div>
              </div>

              {selectedPoll === poll.id ? (
                <div className="mt-4 space-y-4">
                  <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                      Amount to Stake
                    </label>
                    <div className="mt-1">
                      <input
                        type="number"
                        name="amount"
                        id="amount"
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        value={voteAmount}
                        onChange={(e) => setVoteAmount(e.target.value)}
                        placeholder="Enter amount"
                      />
                    </div>
                  </div>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => handleVote(poll.id, true)}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      Vote Yes
                    </button>
                    <button
                      onClick={() => handleVote(poll.id, false)}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Vote No
                    </button>
                    <button
                      onClick={() => setSelectedPoll(null)}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setSelectedPoll(poll.id)}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cast Vote
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Resolved Polls</h2>
        <div className="space-y-4">
          {polls?.filter(poll => poll.resolved).map((poll) => (
            <div key={poll.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{poll.action}</h3>
                  <p className="text-sm text-gray-500">
                    Outcome: {poll.outcome ? (
                      <span className="text-green-600">Approved</span>
                    ) : (
                      <span className="text-red-600">Rejected</span>
                    )}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">Final Market Prices</p>
                  <p className="text-sm text-green-600">Yes: {(poll.yesMarketPrice * 100).toFixed(2)}%</p>
                  <p className="text-sm text-red-600">No: {(poll.noMarketPrice * 100).toFixed(2)}%</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 
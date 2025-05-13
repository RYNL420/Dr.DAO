export const NETWORK_CONFIG = {
  chainId: 31337, // Hardhat local network
  name: 'Hardhat Local',
  rpcUrl: 'http://127.0.0.1:8545',
  blockExplorer: '',
};

// These addresses will be populated after deployment
export const CONTRACT_ADDRESSES = {
  vaultManager: '',
  futarchyVoting: '',
  votingToken: '',
};

export const updateContractAddresses = (addresses: {
  vaultManager: string;
  futarchyVoting: string;
  votingToken: string;
}) => {
  Object.assign(CONTRACT_ADDRESSES, addresses);
}; 
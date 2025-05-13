// This script can be run in the Hardhat console to interact with the contracts
// Run with: npx hardhat console --network localhost
// Then: const interact = require('./scripts/interact.js')

async function getContracts() {
  // Get the deployed contract instances
  const VaultManager = await ethers.getContractFactory("VaultManager");
  const FutarchyVoting = await ethers.getContractFactory("FutarchyVoting");
  const TestToken = await ethers.getContractFactory("TestToken");

  const [deployer] = await ethers.getSigners();
  console.log("Interacting with contracts using account:", deployer.address);

  // Deploy new instances for testing
  const testToken = await TestToken.deploy("Voting Token", "VOTE");
  await testToken.deployed();
  console.log("TestToken deployed to:", testToken.address);

  const vaultManager = await VaultManager.deploy();
  await vaultManager.deployed();
  console.log("VaultManager deployed to:", vaultManager.address);

  const futarchyVoting = await FutarchyVoting.deploy(testToken.address);
  await futarchyVoting.deployed();
  console.log("FutarchyVoting deployed to:", futarchyVoting.address);

  // Grant AGENT_ROLE to VaultManager
  const AGENT_ROLE = await futarchyVoting.AGENT_ROLE();
  await futarchyVoting.grantRole(AGENT_ROLE, vaultManager.address);

  return {
    testToken,
    vaultManager,
    futarchyVoting,
    deployer
  };
}

async function createTestPoll(contracts) {
  const { futarchyVoting } = contracts;
  const action = "Invest 1000 USDC in Aave lending protocol";
  const duration = 86400; // 1 day
  
  const tx = await futarchyVoting.createPoll(action, duration);
  await tx.wait();
  
  const pollId = await futarchyVoting.getLastPollId();
  console.log("Created poll with ID:", pollId);
  return pollId;
}

async function castTestVote(contracts, pollId, prediction, amount) {
  const { testToken, futarchyVoting, deployer } = contracts;
  
  // Approve tokens
  await testToken.approve(futarchyVoting.address, amount);
  console.log("Approved tokens for voting");
  
  // Cast vote
  const tx = await futarchyVoting.castVote(pollId, prediction, amount);
  await tx.wait();
  console.log("Vote cast successfully");
}

async function addTestStrategy(contracts) {
  const { vaultManager } = contracts;
  const strategyName = "Aave Lending Strategy";
  const protocol = "0x1234567890123456789012345678901234567890"; // Example protocol address
  
  const tx = await vaultManager.addStrategy(strategyName, protocol);
  await tx.wait();
  console.log("Added new strategy");
}

// Export functions to be used in the Hardhat console
module.exports = {
  getContracts,
  createTestPoll,
  castTestVote,
  addTestStrategy
}; 
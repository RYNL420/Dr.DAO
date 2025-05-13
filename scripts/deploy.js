const hre = require("hardhat");

async function main() {
  console.log("Deploying contracts...");

  // Deploy VaultManager
  const VaultManager = await hre.ethers.getContractFactory("VaultManager");
  const vaultManager = await VaultManager.deploy();
  await vaultManager.waitForDeployment();
  console.log("VaultManager deployed to:", await vaultManager.getAddress());

  // Deploy FutarchyVoting with a test token
  // For testing, we'll deploy a test ERC20 token first
  const TestToken = await hre.ethers.getContractFactory("TestToken");
  const testToken = await TestToken.deploy("Voting Token", "VOTE");
  await testToken.waitForDeployment();
  console.log("Test token deployed to:", await testToken.getAddress());

  const FutarchyVoting = await hre.ethers.getContractFactory("FutarchyVoting");
  const futarchyVoting = await FutarchyVoting.deploy(await testToken.getAddress());
  await futarchyVoting.waitForDeployment();
  console.log("FutarchyVoting deployed to:", await futarchyVoting.getAddress());

  // Grant AGENT_ROLE to the VaultManager
  const AGENT_ROLE = await futarchyVoting.AGENT_ROLE();
  await futarchyVoting.grantRole(AGENT_ROLE, await vaultManager.getAddress());
  console.log("Granted AGENT_ROLE to VaultManager");

  console.log("\nDeployment Summary:");
  console.log("-------------------");
  console.log("VaultManager:", await vaultManager.getAddress());
  console.log("FutarchyVoting:", await futarchyVoting.getAddress());
  console.log("Voting Token:", await testToken.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 
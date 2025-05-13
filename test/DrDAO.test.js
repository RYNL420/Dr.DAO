const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Dr.DAO System", function () {
  let vaultManager;
  let futarchyVoting;
  let testToken;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    // Get signers
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy TestToken
    const TestToken = await ethers.getContractFactory("TestToken");
    testToken = await TestToken.deploy("Voting Token", "VOTE");
    await testToken.deployed();

    // Deploy VaultManager
    const VaultManager = await ethers.getContractFactory("VaultManager");
    vaultManager = await VaultManager.deploy();
    await vaultManager.deployed();

    // Deploy FutarchyVoting
    const FutarchyVoting = await ethers.getContractFactory("FutarchyVoting");
    futarchyVoting = await FutarchyVoting.deploy(testToken.address);
    await futarchyVoting.deployed();

    // Grant AGENT_ROLE to VaultManager
    const AGENT_ROLE = await futarchyVoting.AGENT_ROLE();
    await futarchyVoting.grantRole(AGENT_ROLE, vaultManager.address);
  });

  describe("Basic Setup", function () {
    it("Should set the right owner", async function () {
      expect(await vaultManager.hasRole(await vaultManager.DEFAULT_ADMIN_ROLE(), owner.address)).to.equal(true);
      expect(await futarchyVoting.hasRole(await futarchyVoting.DEFAULT_ADMIN_ROLE(), owner.address)).to.equal(true);
    });

    it("Should have the correct voting token", async function () {
      expect(await futarchyVoting.votingToken()).to.equal(testToken.address);
    });

    it("Should grant AGENT_ROLE to VaultManager", async function () {
      const AGENT_ROLE = await futarchyVoting.AGENT_ROLE();
      expect(await futarchyVoting.hasRole(AGENT_ROLE, vaultManager.address)).to.equal(true);
    });
  });

  describe("Treasury Management", function () {
    it("Should allow deposits", async function () {
      // First approve tokens
      await testToken.approve(vaultManager.address, ethers.utils.parseEther("100"));
      
      // Then deposit
      await vaultManager.deposit(testToken.address, ethers.utils.parseEther("100"));
      
      const treasuryState = await vaultManager.getTreasuryState();
      expect(treasuryState.tokens[0]).to.equal(testToken.address);
      expect(treasuryState.balances[0]).to.equal(ethers.utils.parseEther("100"));
    });

    it("Should manage strategies", async function () {
      const strategyName = "Test Strategy";
      const protocol = addr1.address;

      // Add strategy
      await vaultManager.addStrategy(strategyName, protocol);
      
      // Get active strategies
      const activeStrategies = await vaultManager.getActiveStrategies();
      expect(activeStrategies.length).to.equal(1);
    });
  });

  describe("Futarchy Voting", function () {
    it("Should create and resolve polls", async function () {
      // Create a poll
      const action = "Test investment action";
      const duration = 86400; // 1 day
      await futarchyVoting.connect(owner).createPoll(action, duration);

      // Get poll details
      const pollId = await futarchyVoting.getLastPollId();
      const poll = await futarchyVoting.getPoll(pollId);
      
      expect(poll.action).to.equal(action);
      expect(poll.resolved).to.equal(false);
    });

    it("Should allow voting", async function () {
      // Create a poll
      const action = "Test investment action";
      const duration = 86400;
      await futarchyVoting.createPoll(action, duration);
      const pollId = await futarchyVoting.getLastPollId();

      // Approve and vote
      await testToken.approve(futarchyVoting.address, ethers.utils.parseEther("10"));
      await futarchyVoting.castVote(pollId, true, ethers.utils.parseEther("10"));

      // Check vote was recorded
      const totalYesStakes = await futarchyVoting.totalYesStakes(pollId);
      expect(totalYesStakes).to.equal(ethers.utils.parseEther("10"));
    });
  });
}); 
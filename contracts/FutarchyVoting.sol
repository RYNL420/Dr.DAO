// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract FutarchyVoting is AccessControl, ReentrancyGuard {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant AGENT_ROLE = keccak256("AGENT_ROLE");

    struct Poll {
        bytes32 id;
        string action;
        uint256 startTime;
        uint256 endTime;
        uint256 yesMarketPrice;
        uint256 noMarketPrice;
        bool resolved;
        bool outcome;
        address creator;
    }

    struct Vote {
        bool prediction;
        uint256 amount;
        uint256 timestamp;
    }

    mapping(bytes32 => Poll) public polls;
    mapping(bytes32 => mapping(address => Vote)) public votes;
    mapping(bytes32 => uint256) public totalYesStakes;
    mapping(bytes32 => uint256) public totalNoStakes;

    IERC20 public votingToken;
    uint256 public constant VOTING_PERIOD = 2 days;
    uint256 public pollCount;

    event PollCreated(bytes32 indexed pollId, string action, uint256 startTime, uint256 endTime);
    event VoteCast(bytes32 indexed pollId, address indexed voter, bool prediction, uint256 amount);
    event PollResolved(bytes32 indexed pollId, bool outcome);

    constructor(address _votingToken) {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(ADMIN_ROLE, msg.sender);
        votingToken = IERC20(_votingToken);
    }

    function createPoll(string memory action, uint256 duration) 
        external 
        onlyRole(AGENT_ROLE) 
        returns (bytes32)
    {
        require(duration <= VOTING_PERIOD, "Duration exceeds maximum voting period");
        
        bytes32 pollId = keccak256(abi.encodePacked(block.timestamp, action, msg.sender));
        uint256 endTime = block.timestamp + duration;
        
        polls[pollId] = Poll({
            id: pollId,
            action: action,
            startTime: block.timestamp,
            endTime: endTime,
            yesMarketPrice: 0,
            noMarketPrice: 0,
            resolved: false,
            outcome: false,
            creator: msg.sender
        });

        pollCount++;
        
        emit PollCreated(pollId, action, block.timestamp, endTime);
        return pollId;
    }

    function castVote(bytes32 pollId, bool prediction, uint256 amount) 
        external 
        nonReentrant 
    {
        require(amount > 0, "Amount must be greater than 0");
        require(!polls[pollId].resolved, "Poll already resolved");
        require(block.timestamp <= polls[pollId].endTime, "Poll ended");
        
        // Transfer tokens from voter to contract
        require(votingToken.transferFrom(msg.sender, address(this), amount), "Token transfer failed");
        
        // Record vote
        votes[pollId][msg.sender] = Vote({
            prediction: prediction,
            amount: amount,
            timestamp: block.timestamp
        });
        
        // Update market prices
        if (prediction) {
            totalYesStakes[pollId] += amount;
        } else {
            totalNoStakes[pollId] += amount;
        }
        
        _updateMarketPrices(pollId);
        
        emit VoteCast(pollId, msg.sender, prediction, amount);
    }

    function resolvePoll(bytes32 pollId) 
        external 
        onlyRole(ADMIN_ROLE) 
    {
        Poll storage poll = polls[pollId];
        require(!poll.resolved, "Poll already resolved");
        require(block.timestamp > poll.endTime, "Poll not ended");
        
        // Determine outcome based on market prices
        poll.outcome = poll.yesMarketPrice > poll.noMarketPrice;
        poll.resolved = true;
        
        emit PollResolved(pollId, poll.outcome);
    }

    function _updateMarketPrices(bytes32 pollId) internal {
        uint256 totalStakes = totalYesStakes[pollId] + totalNoStakes[pollId];
        if (totalStakes > 0) {
            polls[pollId].yesMarketPrice = (totalYesStakes[pollId] * 1e18) / totalStakes;
            polls[pollId].noMarketPrice = (totalNoStakes[pollId] * 1e18) / totalStakes;
        }
    }

    function getPoll(bytes32 pollId) 
        external 
        view 
        returns (
            string memory action,
            uint256 startTime,
            uint256 endTime,
            uint256 yesMarketPrice,
            uint256 noMarketPrice,
            bool resolved,
            bool outcome
        ) 
    {
        Poll storage poll = polls[pollId];
        return (
            poll.action,
            poll.startTime,
            poll.endTime,
            poll.yesMarketPrice,
            poll.noMarketPrice,
            poll.resolved,
            poll.outcome
        );
    }

    function getLastPollId() external view returns (bytes32) {
        require(pollCount > 0, "No polls created");
        return polls[bytes32(pollCount - 1)].id;
    }
} 
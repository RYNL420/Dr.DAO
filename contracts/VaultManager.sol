// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract VaultManager is AccessControl, ReentrancyGuard {
    using SafeERC20 for IERC20;

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant STRATEGY_ROLE = keccak256("STRATEGY_ROLE");

    struct Strategy {
        string name;
        address protocol;
        uint256 allocation;
        bool active;
        uint256 lastUpdate;
    }

    struct Asset {
        address token;
        uint256 balance;
        uint256 allocated;
    }

    mapping(bytes32 => Strategy) public strategies;
    mapping(address => Asset) public assets;
    address[] public supportedTokens;
    bytes32[] public activeStrategies;

    event StrategyAdded(bytes32 indexed strategyId, string name, address protocol);
    event StrategyUpdated(bytes32 indexed strategyId, uint256 allocation);
    event AssetDeposited(address indexed token, uint256 amount);
    event AssetWithdrawn(address indexed token, uint256 amount);

    constructor() {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(ADMIN_ROLE, msg.sender);
    }

    function addStrategy(
        string memory name,
        address protocol
    ) external onlyRole(ADMIN_ROLE) returns (bytes32) {
        bytes32 strategyId = keccak256(abi.encodePacked(name, protocol));
        require(strategies[strategyId].protocol == address(0), "Strategy already exists");

        strategies[strategyId] = Strategy({
            name: name,
            protocol: protocol,
            allocation: 0,
            active: true,
            lastUpdate: block.timestamp
        });

        activeStrategies.push(strategyId);
        emit StrategyAdded(strategyId, name, protocol);
        return strategyId;
    }

    function updateStrategy(
        bytes32 strategyId,
        uint256 allocation,
        bool active
    ) external onlyRole(ADMIN_ROLE) {
        require(strategies[strategyId].protocol != address(0), "Strategy does not exist");
        
        strategies[strategyId].allocation = allocation;
        strategies[strategyId].active = active;
        strategies[strategyId].lastUpdate = block.timestamp;

        emit StrategyUpdated(strategyId, allocation);
    }

    function deposit(address token, uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        
        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);
        
        if (assets[token].token == address(0)) {
            assets[token] = Asset({
                token: token,
                balance: amount,
                allocated: 0
            });
            supportedTokens.push(token);
        } else {
            assets[token].balance += amount;
        }

        emit AssetDeposited(token, amount);
    }

    function withdraw(
        address token,
        uint256 amount
    ) external onlyRole(ADMIN_ROLE) nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        require(assets[token].balance >= amount, "Insufficient balance");

        assets[token].balance -= amount;
        IERC20(token).safeTransfer(msg.sender, amount);

        emit AssetWithdrawn(token, amount);
    }

    function getTreasuryState() external view returns (
        address[] memory tokens,
        uint256[] memory balances,
        uint256[] memory allocations
    ) {
        uint256 length = supportedTokens.length;
        tokens = new address[](length);
        balances = new uint256[](length);
        allocations = new uint256[](length);

        for (uint256 i = 0; i < length; i++) {
            address token = supportedTokens[i];
            tokens[i] = token;
            balances[i] = assets[token].balance;
            allocations[i] = assets[token].allocated;
        }

        return (tokens, balances, allocations);
    }

    function getActiveStrategies() external view returns (bytes32[] memory) {
        return activeStrategies;
    }

    function getTotalValueLocked() external view returns (uint256) {
        uint256 total = 0;
        for (uint256 i = 0; i < supportedTokens.length; i++) {
            address token = supportedTokens[i];
            total += assets[token].balance;
        }
        return total;
    }
} 
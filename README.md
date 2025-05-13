# Dr.DAO

Dr.DAO is an AI-powered treasury management system for DAOs, featuring autonomous decision-making, futarchy-based governance, and advanced portfolio management capabilities.

## Project Status

This project is currently in active development. The core smart contracts are implemented and the frontend is under development.

### Implemented Features
- ✅ Smart Contracts
  - VaultManager for treasury operations
  - FutarchyVoting for governance
  - TestToken for development testing
- ✅ Frontend Structure
  - Modern React + TypeScript setup
  - Wallet integration with RainbowKit
  - Responsive UI with Tailwind CSS
- ✅ Local Development Environment
  - Hardhat for local blockchain
  - Contract deployment scripts
  - Development tooling setup

### In Progress
- 🔄 Frontend-Contract Integration
- 🔄 Governance Implementation
- 🔄 Treasury Management Features
- 🔄 AI Integration

### Known Issues
- Frontend connection issues with wagmi v2 and RainbowKit
- Local development server configuration needs adjustment
- Contract deployment script requires updates for latest Hardhat version

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for development server
- Tailwind CSS for styling
- RainbowKit for wallet connections
- Wagmi v2 for blockchain interactions

### Smart Contracts
- Solidity ^0.8.19
- OpenZeppelin contracts
- Hardhat development environment
- Ethers.js for contract interactions

## Development Setup

### Prerequisites
- Node.js (v16+)
- Git
- MetaMask or another Web3 wallet
- npm or yarn

### Local Development

1. **Clone and Install Dependencies**
```bash
git clone <your-repo-url>
cd dr-dao
npm install
```

2. **Start Local Blockchain**
```bash
# Terminal 1: Start Hardhat Node
npx hardhat node

# Terminal 2: Deploy Contracts
npx hardhat run scripts/deploy.js --network localhost
```

3. **Start Frontend Development Server**
```bash
# Terminal 3
cd app
npm install
npm run dev
```

### Smart Contract Development
```bash
# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Deploy to local network
npx hardhat run scripts/deploy.js --network localhost
```

### Frontend Development
```bash
cd app
npm run dev
```

## Project Structure

```
dr-dao/
├── app/                    # Frontend application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   └── utils/         # Utility functions
├── contracts/             # Smart contracts
│   ├── VaultManager.sol
│   ├── FutarchyVoting.sol
│   └── TestToken.sol
├── scripts/               # Deployment & interaction scripts
└── test/                 # Contract test files
```

## Configuration

### Local Network
- Network Name: Hardhat Local
- RPC URL: http://127.0.0.1:8545
- Chain ID: 31337
- Currency Symbol: ETH

### Contract Addresses (Local Development)
After deployment, the contracts will be available at:
- VaultManager: [Address from deployment]
- FutarchyVoting: [Address from deployment]
- TestToken: [Address from deployment]

## Troubleshooting

1. **Port Conflicts**
   - If port 8545 is in use, kill the existing process:
     ```bash
     # Windows
     netstat -ano | findstr :8545
     taskkill /PID [PID] /F
     ```

2. **Frontend Development**
   - If the frontend fails to start, try:
     ```bash
     cd app
     rm -rf node_modules
     npm install
     npm run dev
     ```

3. **Contract Deployment**
   - Ensure Hardhat node is running
   - Check network configuration in hardhat.config.js
   - Verify MetaMask is connected to localhost:8545

4. **Known Frontend Issues**
   - The current implementation has some compatibility issues with wagmi v2
   - RainbowKit integration needs to be updated for the latest version
   - Some wallet connection features may not work as expected

## Next Steps
1. Update wagmi and RainbowKit dependencies to latest versions
2. Fix frontend connection issues
3. Implement contract interaction functionality
4. Add proper error handling and loading states
5. Complete the wallet integration

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

Project Link: [https://github.com/yourusername/dr-dao](https://github.com/yourusername/dr-dao)
# 1v1 Football Game
<img width="1430" alt="Screenshot 2025-02-18 at 2 15 31 AM" src="https://github.com/user-attachments/assets/522b44b6-c3b7-4d0f-99f7-de73b27e90ff" />

## Overview
This is a decentralized 1v1 football game where players connect their crypto wallets, create or join a game, and stake tokens. The winner takes the token pool.

## Features
- **First-Person 3D Gameplay**: Uses Three.js and react-three-fiber.
- **Wallet Connectivity**: Players connect via MetaMask or WalletConnect.
- **Matchmaking System**: Players create or join game sessions.
- **Token Staking & Payouts**: Smart contract manages stakes and winner rewards.
- **Physics-Based Soccer Mechanics**: Uses cannon.js for realistic physics.

## Tech Stack
- **Frontend**: Next.js, React, react-three-fiber, drei
- **Blockchain**: Solidity, Ethereum Smart Contracts
- **Wallet Integration**: wagmi, ethers.js
- **Real-time Backend** (Optional): Socket.IO for matchmaking

## Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/AnonO6/soccer.fun.git
   cd soccer.fun
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm run dev
   ```

## Smart Contract Deployment
1. Navigate to the `contracts/` folder.
2. Deploy using Hardhat:
   ```sh
   npx hardhat compile
   npx hardhat run scripts/deploy.js --network testnet
   ```
3. Copy the deployed contract address and update it in `config.js`.

## Wallet Connection
- The app uses **wagmi** for wallet authentication.
- Players must connect their wallet before joining a game.
- Only ERC-20 tokens supported for staking.

## Game Flow
1. **Connect Wallet**
2. **Create or Join a Game**
3. **Stake Tokens**
4. **Play the Match**
5. **Winner Receives Staked Tokens**

## Controls
- **WASD**: Move Player
- **Space**: Jump
- **Shift**: Run
- **Mouse**: Look Around

## Future Enhancements
- Multiplayer Mode with WebRTC
- NFT-based Player Avatars
- AI-based Opponents

## License
MIT License. See `LICENSE` for details.

## Credits
- [Three.js](https://threejs.org/)
- [React Three Fiber](https://github.com/pmndrs/react-three-fiber)
- [Wagmi](https://wagmi.sh/)
- [Socket.IO](https://socket.io/)

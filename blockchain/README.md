# Blockchain Module - Sensor Token (SENS)

This module implements an ERC-20 token system for rewarding sensors that send data to the system. Each sensor receives tokens for every message transmitted.

## Overview

- **Token Name**: SensorToken
- **Symbol**: SENS
- **Decimals**: 18
- **Reward per Message**: 1 SENS (configurable)

## Smart Contract

The `SensorToken.sol` contract is a standard ERC-20 token with additional functionality:

- **Sensor Registration**: Each sensor ID is mapped to a wallet address
- **Automatic Rewards**: Sensors receive tokens when they send data (auto-registers on first message)
- **Batch Operations**: Support for registering and rewarding multiple sensors at once
- **Balance Queries**: Get token balance by sensor ID

## Quick Start with Docker

The blockchain module is **automatically started** when running docker-compose:

```bash
docker-compose up -d
```

This starts a Hardhat node and automatically deploys the SensorToken contract. The backend is pre-configured to connect to it.

**Default Configuration:**
- Contract Address: `0x5FbDB2315678afecb367f032d93F642f64180aa3`
- Private Key: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80` (Hardhat account #0)
- Chain ID: `31337`

## Manual Setup

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
cd blockchain
npm install
```

### Local Development

1. Start a local Hardhat node:
```bash
npm run node
```

2. Deploy the contract (in a new terminal):
```bash
npm run deploy:local
```

3. Note the deployed contract address for backend configuration.

### Testnet Deployment (Sepolia)

1. Create a `.env` file:
```bash
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
PRIVATE_KEY=your_wallet_private_key
```

2. Deploy to Sepolia:
```bash
npm run deploy:sepolia
```

### Testing

```bash
npm test
```

## Backend Integration

The backend automatically integrates with the blockchain when configured.

### Docker Networking Note

When running with Docker Compose, the backend runs inside a container. To connect to a Hardhat node running on your host machine, use `host.docker.internal` instead of `localhost`:

```bash
# Set environment variable before running docker-compose
export BLOCKCHAIN_RPC_URL=http://host.docker.internal:8545
```

The docker-compose.yml already includes `extra_hosts` configuration to make `host.docker.internal` resolve correctly on Linux.

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `BLOCKCHAIN_ENABLED` | Enable/disable blockchain features | `false` |
| `BLOCKCHAIN_RPC_URL` | Ethereum RPC endpoint | `http://host.docker.internal:8545` |
| `BLOCKCHAIN_CONTRACT_ADDRESS` | Deployed contract address | - |
| `BLOCKCHAIN_PRIVATE_KEY` | Contract owner's private key | - |
| `BLOCKCHAIN_CHAIN_ID` | Network chain ID | `31337` |
| `BLOCKCHAIN_REWARD_AMOUNT` | Tokens per message | `1` |

### Quick Start with Local Hardhat Node

1. Start Hardhat node (in one terminal):
```bash
cd blockchain
npm install
npx hardhat node
```

2. Deploy the contract (in another terminal):
```bash
cd blockchain
npm run deploy:local
```

3. Copy the deployed contract address and first account's private key from Hardhat output.

4. Create a `.env` file in the project root or set environment variables:
```bash
export BLOCKCHAIN_ENABLED=true
export BLOCKCHAIN_RPC_URL=http://host.docker.internal:8545
export BLOCKCHAIN_CONTRACT_ADDRESS=<deployed_contract_address>
export BLOCKCHAIN_PRIVATE_KEY=<private_key_from_hardhat>
```

5. Restart Docker containers:
```bash
docker-compose down
docker-compose up -d
```

### Simulation Mode

If blockchain is enabled but not fully configured (no private key or contract address), the system runs in simulation mode:
- Wallets are generated deterministically for each sensor
- Transfers are recorded locally in MongoDB
- No actual blockchain transactions occur

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/blockchain/status` | Get blockchain service status |
| GET | `/api/blockchain/balances` | Get all sensor token balances |
| GET | `/api/blockchain/balances/{sensorId}` | Get balance for specific sensor |
| GET | `/api/blockchain/transfers` | Get recent token transfers |
| GET | `/api/blockchain/transfers/{sensorId}` | Get transfers for specific sensor |
| GET | `/api/blockchain/wallets/{sensorId}` | Get or create wallet for sensor |

## Frontend

The admin dashboard includes a "Token Balances" tab that displays:
- Blockchain connection status
- All sensor wallets and their token balances
- Number of messages sent by each sensor
- Recent token transfer history

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│     Sensors     │────▶│  MQTT Broker    │────▶│    Backend      │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └────────┬────────┘
                                                         │
                                                         ▼
                        ┌─────────────────┐     ┌─────────────────┐
                        │                 │     │                 │
                        │   Blockchain    │◀────│ BlockchainSvc   │
                        │   (ERC-20)      │     │                 │
                        └─────────────────┘     └─────────────────┘
```

## Supported Networks

- **Local**: Hardhat Network (Chain ID: 31337)
- **Testnet**: Sepolia (Chain ID: 11155111)
- **Mainnet**: Ethereum Mainnet (Chain ID: 1) - Not recommended for this demo

## Security Considerations

1. **Private Keys**: Never commit private keys to version control
2. **Testnet Only**: Use testnet networks for development/testing
3. **Gas Costs**: Mainnet deployment and transactions will incur real costs
4. **Smart Contract**: The contract is not audited - use for educational purposes only

## License

MIT License

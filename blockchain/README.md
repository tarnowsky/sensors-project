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

## License

MIT License

# Base Builder Contracts

A collection of foundational smart contract primitives for building on Base. Each contract is a self-contained, production-pattern implementation covering common onchain use cases.

## Contracts

| # | Contract | Description |
|---|----------|-------------|
| 1 | `BaseToken` | ERC-20 token with mint-on-deploy |
| 2 | `BaseNFT` | ERC-721 with sequential minting and metadata |
| 3 | `OnchainRegistry` | Decentralized key-value store |
| 4 | `PaymentSplitter` | Split ETH among configurable payees |
| 5 | `TimeLock` | Queue + execute transactions after delay |
| 6 | `MultiSig` | Multi-signature wallet with confirmations |
| 7 | `Vault` | ETH deposit/withdraw with pause mechanism |
| 8 | `Staking` | ERC-20 staking with reward distribution |
| 9 | `SimpleDAO` | Onchain proposal + weighted voting |
| 10 | `AirdropDistributor` | Batch + claimable token distribution |
| 11 | `CloneFactory` | EIP-1167 minimal proxy deployer |
| 12 | `FeeRouter` | Protocol fee routing with referrals |
| 13 | `Escrow` | P2P escrow with arbiter dispute resolution |

## Setup

```bash
npm install
npx hardhat compile
npx hardhat test
```

## Deploy to Base Mainnet

```bash
# Keys stored securely via Hardhat Keystore (never exposed in env)
npx hardhat run scripts/deploy-all.ts --network base
```

## Architecture

All contracts are written in Solidity ^0.8.24 with optimizer enabled. No external dependencies.

Each contract follows these principles:
- Minimal, self-contained implementations
- No unnecessary inheritance chains
- Gas-optimized with custom errors where appropriate
- Event-driven for offchain indexing

## License

MIT

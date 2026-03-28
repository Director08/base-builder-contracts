# Gas Estimates

Approximate deployment costs on Base mainnet (as of March 2026).

| Contract | Estimated Gas | Notes |
|----------|--------------|-------|
| BaseToken | ~500k | ERC-20 with mint |
| BaseNFT | ~700k | ERC-721 with metadata |
| OnchainRegistry | ~400k | Key-value store |
| PaymentSplitter | ~500k | Depends on payee count |
| TimeLock | ~600k | Includes queue/execute |
| MultiSig | ~800k | Depends on owner count |
| Vault | ~400k | Simple deposit/withdraw |
| Staking | ~600k | Reward calculation logic |
| SimpleDAO | ~700k | Proposal + voting |
| AirdropDistributor | ~500k | Batch transfers |
| CloneFactory | ~300k | Minimal proxy pattern |
| FeeRouter | ~500k | Fee splitting |
| Escrow | ~600k | State machine |

Total estimated deployment: ~7M gas (~$0.50-2.00 on Base L2)

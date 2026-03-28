# AirdropDistributor

Batch and claimable token distribution.

## Functions
- `batchTransfer(token, recipients, amounts)` - Direct batch send
- `createAirdrop(token, recipients, amounts)` - Set up claimable drop (admin)
- `claim(token)` - Claim allocated tokens
- `batchTransferETH(recipients, amounts)` - Batch ETH send (payable)

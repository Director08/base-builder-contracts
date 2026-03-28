# MultiSig

Multi-signature wallet requiring multiple owner confirmations.

## Constructor
- `owners`: Array of owner addresses
- `required`: Number of confirmations needed

## Functions
- `submit(to, value, data)` - Propose transaction
- `confirm(txIndex)` - Confirm transaction
- `execute(txIndex)` - Execute confirmed transaction
- `revoke(txIndex)` - Revoke confirmation
- `getTransactionCount()` - Total proposals
- `getOwners()` - List all owners

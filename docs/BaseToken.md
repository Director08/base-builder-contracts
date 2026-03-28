# BaseToken

Minimal ERC-20 token implementation with mint-on-deploy.

## Constructor
- `name`: Token name
- `symbol`: Token symbol
- `initialSupply`: Number of tokens (multiplied by 10^18)

## Functions
- `transfer(to, amount)` - Transfer tokens
- `approve(spender, amount)` - Approve spender
- `transferFrom(from, to, amount)` - Transfer with allowance

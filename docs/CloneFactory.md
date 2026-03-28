# CloneFactory

Gas-efficient contract deployment using EIP-1167 minimal proxy pattern.

## Functions
- `clone(implementation)` - Deploy minimal proxy (CREATE)
- `cloneDeterministic(implementation, salt)` - Deploy with CREATE2
- `predictDeterministicAddress(implementation, salt)` - Predict address

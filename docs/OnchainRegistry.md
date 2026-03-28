# OnchainRegistry

Decentralized key-value store for onchain data.

## Functions
- `register(key, value)` - Register a new key-value pair
- `update(keyHash, newValue)` - Update existing value (owner only)
- `transferOwnership(keyHash, newOwner)` - Transfer key ownership
- `lookup(key)` - Look up value by key string
- `getUserKeyCount(user)` - Count keys owned by address

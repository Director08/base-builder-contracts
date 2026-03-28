# PaymentSplitter

Split ETH payments among configurable recipients.

## Constructor
- `payees`: Array of recipient addresses
- `shares`: Array of share amounts

## Functions
- `release(account)` - Release owed ETH to payee
- `releasable(account)` - View pending release amount
- `getPayeeCount()` - Number of payees

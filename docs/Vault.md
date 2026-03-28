# Vault

ETH deposit/withdraw vault with per-user accounting and pause mechanism.

## Constructor
No arguments. Deployer becomes admin.

## Functions
- `deposit()` - Deposit ETH (payable)
- `withdraw(amount)` - Withdraw specific amount
- `withdrawAll()` - Withdraw entire balance
- `setPaused(bool)` - Pause/unpause (admin only)
- `getContractBalance()` - View total ETH held

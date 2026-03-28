# Staking

ERC-20 token staking with configurable reward distribution.

## Constructor
- `stakingToken`: Address of token to stake
- `rewardToken`: Address of reward token
- `rewardRate`: Rewards per second

## Functions
- `stake(amount)` - Stake tokens
- `unstake(amount)` - Withdraw staked tokens
- `claimReward()` - Claim accumulated rewards
- `earned(account)` - View pending rewards
- `rewardPerToken()` - Current reward rate per token

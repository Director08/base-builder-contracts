# FeeRouter

Protocol fee routing with referral support.

## Constructor
- `treasury`: Fee recipient address
- `protocolFeeBps`: Protocol fee in basis points
- `referralFeeBps`: Referral fee in basis points

## Functions
- `registerAsReferrer()` - Register as referrer
- `routeFee(referrer)` - Route payment with fees (payable)
- `withdrawReferralEarnings()` - Withdraw referral earnings
- `updateFees(protocolBps, referralBps)` - Update fee config (admin)
- `updateTreasury(address)` - Change treasury (admin)

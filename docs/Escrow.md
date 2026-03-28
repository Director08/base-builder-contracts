# Escrow

P2P escrow for ETH trades with arbiter dispute resolution.

## Functions
- `createDeal(seller, arbiter, arbiterFeeBps)` - Create and fund escrow (payable)
- `release(id)` - Release funds to seller (buyer only)
- `refund(id)` - Refund to buyer (seller only)
- `dispute(id)` - Open dispute (buyer or seller)
- `resolveDispute(id, releaseToSeller)` - Resolve (arbiter only)

## States
Created -> Funded -> Released/Refunded/Disputed

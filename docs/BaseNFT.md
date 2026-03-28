# BaseNFT

Minimal ERC-721 NFT collection with sequential minting.

## Constructor
- `name`: Collection name
- `symbol`: Collection symbol
- `baseURI`: Metadata base URI

## Functions
- `mint(to)` - Mint new token (owner only)
- `transferFrom(from, to, tokenId)` - Transfer NFT
- `approve(spender, tokenId)` - Approve transfer
- `setApprovalForAll(operator, approved)` - Bulk approval
- `tokenURI(tokenId)` - Get metadata URI
- `setBaseURI(newURI)` - Update base URI (owner only)

# Deployment Scripts

## Deploy All Contracts
```bash
npx hardhat run scripts/deploy-all.ts --network base
```

## Deploy Individual Contracts
```bash
npx hardhat run scripts/deploy-token.ts --network base
npx hardhat run scripts/deploy-nft.ts --network base
npx hardhat run scripts/deploy-vault.ts --network base
npx hardhat run scripts/deploy-dao.ts --network base
npx hardhat run scripts/deploy-escrow.ts --network base
npx hardhat run scripts/deploy-multisig.ts --network base
npx hardhat run scripts/deploy-staking.ts --network base
npx hardhat run scripts/deploy-feerouter.ts --network base
```

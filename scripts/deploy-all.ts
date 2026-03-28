import { network } from "hardhat";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function deployWithRetry(
  viem: any,
  name: string,
  args?: any[],
  retries = 3
): Promise<any> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const contract = args
        ? await viem.deployContract(name, args)
        : await viem.deployContract(name);
      return contract;
    } catch (error: any) {
      if (attempt === retries) throw error;
      console.log(`  Retrying in 5s (attempt ${attempt}/${retries})...`);
      await sleep(5000);
    }
  }
}

async function main() {
  const { viem } = await network.connect();
  const [walletClient] = await viem.getWalletClients();
  const DELAY = 3000;

  console.log("Deploying all 13 contracts to Base mainnet...");
  console.log("Deployer:", walletClient.account.address);

  // 1. BaseToken (ERC-20)
  console.log("\n1/13 - Deploying BaseToken...");
  const baseToken = await deployWithRetry(viem, "BaseToken", [
    "Base Builder Token",
    "BBT",
    1_000_000n,
  ]);
  console.log(`  Done: ${baseToken.address}`);

  // 2. BaseNFT (ERC-721)
  await sleep(DELAY);
  console.log("2/13 - Deploying BaseNFT...");
  const baseNFT = await deployWithRetry(viem, "BaseNFT", [
    "Base Builder NFT",
    "BBNFT",
    "https://api.example.com/nft/",
  ]);
  console.log(`  Done: ${baseNFT.address}`);

  // 3. OnchainRegistry
  await sleep(DELAY);
  console.log("3/13 - Deploying OnchainRegistry...");
  const registry = await deployWithRetry(viem, "OnchainRegistry");
  console.log(`  Done: ${registry.address}`);

  // 4. PaymentSplitter
  await sleep(DELAY);
  console.log("4/13 - Deploying PaymentSplitter...");
  const splitter = await deployWithRetry(viem, "PaymentSplitter", [
    [walletClient.account.address, "0x000000000000000000000000000000000000dEaD"],
    [80n, 20n],
  ]);
  console.log(`  Done: ${splitter.address}`);

  // 5. TimeLock
  await sleep(DELAY);
  console.log("5/13 - Deploying TimeLock...");
  const timelock = await deployWithRetry(viem, "TimeLock");
  console.log(`  Done: ${timelock.address}`);

  // 6. MultiSig
  await sleep(DELAY);
  console.log("6/13 - Deploying MultiSig...");
  const multisig = await deployWithRetry(viem, "MultiSig", [
    [walletClient.account.address],
    1n,
  ]);
  console.log(`  Done: ${multisig.address}`);

  // 7. Vault
  await sleep(DELAY);
  console.log("7/13 - Deploying Vault...");
  const vault = await deployWithRetry(viem, "Vault");
  console.log(`  Done: ${vault.address}`);

  // 8. Staking
  await sleep(DELAY);
  console.log("8/13 - Deploying Staking...");
  const staking = await deployWithRetry(viem, "Staking", [
    baseToken.address,
    baseToken.address,
    1000000000000000n,
  ]);
  console.log(`  Done: ${staking.address}`);

  // 9. SimpleDAO
  await sleep(DELAY);
  console.log("9/13 - Deploying SimpleDAO...");
  const dao = await deployWithRetry(viem, "SimpleDAO", [604800n]);
  console.log(`  Done: ${dao.address}`);

  // 10. AirdropDistributor
  await sleep(DELAY);
  console.log("10/13 - Deploying AirdropDistributor...");
  const airdrop = await deployWithRetry(viem, "AirdropDistributor");
  console.log(`  Done: ${airdrop.address}`);

  // 11. CloneFactory
  await sleep(DELAY);
  console.log("11/13 - Deploying CloneFactory...");
  const cloneFactory = await deployWithRetry(viem, "CloneFactory");
  console.log(`  Done: ${cloneFactory.address}`);

  // 12. FeeRouter
  await sleep(DELAY);
  console.log("12/13 - Deploying FeeRouter...");
  const feeRouter = await deployWithRetry(viem, "FeeRouter", [
    walletClient.account.address,
    250n,
    50n,
  ]);
  console.log(`  Done: ${feeRouter.address}`);

  // 13. Escrow
  await sleep(DELAY);
  console.log("13/13 - Deploying Escrow...");
  const escrow = await deployWithRetry(viem, "Escrow");
  console.log(`  Done: ${escrow.address}`);

  console.log("\n=== All 13 contracts deployed! ===");
  console.log("Deployer:", walletClient.account.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

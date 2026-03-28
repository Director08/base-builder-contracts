import hre from "hardhat";
import { parseEther } from "viem";

async function main() {
  const [deployer] = await hre.viem.getWalletClients();
  const publicClient = await hre.viem.getPublicClient();

  console.log("Deploying all 13 contracts...");
  console.log("Deployer:", deployer.account.address);

  // 1. BaseToken (ERC-20)
  const baseToken = await hre.viem.deployContract("BaseToken", [
    "Base Builder Token",
    "BBT",
    1_000_000n,
  ]);
  console.log("1. BaseToken:", baseToken.address);

  // 2. BaseNFT (ERC-721)
  const baseNFT = await hre.viem.deployContract("BaseNFT", [
    "Base Builder NFT",
    "BBNFT",
    "https://api.example.com/nft/",
  ]);
  console.log("2. BaseNFT:", baseNFT.address);

  // 3. OnchainRegistry
  const registry = await hre.viem.deployContract("OnchainRegistry");
  console.log("3. OnchainRegistry:", registry.address);

  // 4. PaymentSplitter
  const splitter = await hre.viem.deployContract("PaymentSplitter", [
    [deployer.account.address, "0x000000000000000000000000000000000000dEaD"],
    [80n, 20n],
  ]);
  console.log("4. PaymentSplitter:", splitter.address);

  // 5. TimeLock
  const timelock = await hre.viem.deployContract("TimeLock");
  console.log("5. TimeLock:", timelock.address);

  // 6. MultiSig
  const multisig = await hre.viem.deployContract("MultiSig", [
    [deployer.account.address],
    1n,
  ]);
  console.log("6. MultiSig:", multisig.address);

  // 7. Vault
  const vault = await hre.viem.deployContract("Vault");
  console.log("7. Vault:", vault.address);

  // 8. Staking
  const staking = await hre.viem.deployContract("Staking", [
    baseToken.address,
    baseToken.address,
    1000000000000000n, // 1e15
  ]);
  console.log("8. Staking:", staking.address);

  // 9. SimpleDAO
  const dao = await hre.viem.deployContract("SimpleDAO", [
    604800n, // 7 days in seconds
  ]);
  console.log("9. SimpleDAO:", dao.address);

  // 10. AirdropDistributor
  const airdrop = await hre.viem.deployContract("AirdropDistributor");
  console.log("10. AirdropDistributor:", airdrop.address);

  // 11. CloneFactory
  const cloneFactory = await hre.viem.deployContract("CloneFactory");
  console.log("11. CloneFactory:", cloneFactory.address);

  // 12. FeeRouter
  const feeRouter = await hre.viem.deployContract("FeeRouter", [
    deployer.account.address,
    250n,
    50n,
  ]);
  console.log("12. FeeRouter:", feeRouter.address);

  // 13. Escrow
  const escrow = await hre.viem.deployContract("Escrow");
  console.log("13. Escrow:", escrow.address);

  console.log("\n=== All 13 contracts deployed! ===");
  console.log("Deployer:", deployer.account.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

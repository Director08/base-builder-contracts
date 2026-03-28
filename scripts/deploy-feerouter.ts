import { network } from "hardhat";

async function main() {
  const { viem } = await network.connect();
  const [deployer] = await viem.getWalletClients();
  console.log("Deploying FeeRouter...");
  const feeRouter = await viem.deployContract("FeeRouter", [deployer.account.address, 250n, 50n]);
  console.log("FeeRouter deployed:", feeRouter.address);
}

main().catch(console.error);

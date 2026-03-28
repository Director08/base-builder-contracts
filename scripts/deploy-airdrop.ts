import { network } from "hardhat";

async function main() {
  const { viem } = await network.connect();
  console.log("Deploying AirdropDistributor...");
  const airdrop = await viem.deployContract("AirdropDistributor");
  console.log("AirdropDistributor deployed:", airdrop.address);
}

main().catch(console.error);

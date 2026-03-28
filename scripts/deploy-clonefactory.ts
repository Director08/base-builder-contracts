import { network } from "hardhat";

async function main() {
  const { viem } = await network.connect();
  console.log("Deploying CloneFactory...");
  const cloneFactory = await viem.deployContract("CloneFactory");
  console.log("CloneFactory deployed:", cloneFactory.address);
}

main().catch(console.error);

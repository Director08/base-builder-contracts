import { network } from "hardhat";

async function main() {
  const { viem } = await network.connect();
  console.log("Deploying TimeLock...");
  const timelock = await viem.deployContract("TimeLock");
  console.log("TimeLock deployed:", timelock.address);
}

main().catch(console.error);

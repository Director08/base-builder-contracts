import { network } from "hardhat";

async function main() {
  const { viem } = await network.connect();
  console.log("Deploying OnchainRegistry...");
  const registry = await viem.deployContract("OnchainRegistry");
  console.log("OnchainRegistry deployed:", registry.address);
}

main().catch(console.error);

import { network } from "hardhat";

async function main() {
  const { viem } = await network.connect();
  console.log("Deploying Vault...");
  const vault = await viem.deployContract("Vault");
  console.log("Vault deployed:", vault.address);
}

main().catch(console.error);

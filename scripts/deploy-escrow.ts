import { network } from "hardhat";

async function main() {
  const { viem } = await network.connect();
  console.log("Deploying Escrow...");
  const escrow = await viem.deployContract("Escrow");
  console.log("Escrow deployed:", escrow.address);
}

main().catch(console.error);

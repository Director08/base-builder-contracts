import { network } from "hardhat";

async function main() {
  const { viem } = await network.connect();
  console.log("Deploying BaseToken...");
  const token = await viem.deployContract("BaseToken", ["Base Builder Token", "BBT", 1_000_000n]);
  console.log("BaseToken deployed:", token.address);
}

main().catch(console.error);

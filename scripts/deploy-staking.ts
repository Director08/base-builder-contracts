import { network } from "hardhat";

async function main() {
  const { viem } = await network.connect();
  const tokenAddress = process.env.TOKEN_ADDRESS;
  if (!tokenAddress) throw new Error("Set TOKEN_ADDRESS env var");
  console.log("Deploying Staking...");
  const staking = await viem.deployContract("Staking", [tokenAddress, tokenAddress, 1000000000000000n]);
  console.log("Staking deployed:", staking.address);
}

main().catch(console.error);

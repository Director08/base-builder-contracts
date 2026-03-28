import { network } from "hardhat";

async function main() {
  const { viem } = await network.connect();
  console.log("Deploying SimpleDAO...");
  const dao = await viem.deployContract("SimpleDAO", [604800n]);
  console.log("SimpleDAO deployed:", dao.address);
}

main().catch(console.error);

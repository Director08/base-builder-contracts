import { network } from "hardhat";

async function main() {
  const { viem } = await network.connect();
  const [deployer] = await viem.getWalletClients();
  console.log("Deploying MultiSig...");
  const multisig = await viem.deployContract("MultiSig", [[deployer.account.address], 1n]);
  console.log("MultiSig deployed:", multisig.address);
}

main().catch(console.error);

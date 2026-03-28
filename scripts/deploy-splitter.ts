import { network } from "hardhat";

async function main() {
  const { viem } = await network.connect();
  const [deployer] = await viem.getWalletClients();
  console.log("Deploying PaymentSplitter...");
  const splitter = await viem.deployContract("PaymentSplitter", [
    [deployer.account.address, "0x000000000000000000000000000000000000dEaD"],
    [80n, 20n],
  ]);
  console.log("PaymentSplitter deployed:", splitter.address);
}

main().catch(console.error);

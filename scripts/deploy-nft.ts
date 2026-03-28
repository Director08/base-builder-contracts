import { network } from "hardhat";

async function main() {
  const { viem } = await network.connect();
  console.log("Deploying BaseNFT...");
  const nft = await viem.deployContract("BaseNFT", ["Base Builder NFT", "BBNFT", "https://api.example.com/nft/"]);
  console.log("BaseNFT deployed:", nft.address);
}

main().catch(console.error);

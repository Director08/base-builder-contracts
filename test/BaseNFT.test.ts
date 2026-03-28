import { expect } from "chai";
import { network } from "hardhat";
import { getAddress } from "viem";

describe("BaseNFT", function () {
  it("should set name and symbol correctly", async function () {
    const { viem } = await network.connect();
    const contract = await viem.deployContract("BaseNFT", ["Test NFT", "TNFT", "https://test.com/"]);

    expect(await contract.read.name()).to.equal("Test NFT");
    expect(await contract.read.symbol()).to.equal("TNFT");
  });

  it("should mint and increment totalSupply", async function () {
    const { viem } = await network.connect();
    const [deployer] = await viem.getWalletClients();
    const contract = await viem.deployContract("BaseNFT", ["Test NFT", "TNFT", "https://test.com/"]);

    expect(await contract.read.totalSupply()).to.equal(0n);

    await contract.write.mint([deployer.account.address]);
    expect(await contract.read.totalSupply()).to.equal(1n);

    await contract.write.mint([deployer.account.address]);
    expect(await contract.read.totalSupply()).to.equal(2n);
  });

  it("should not allow non-owner to mint", async function () {
    const { viem } = await network.connect();
    const [deployer, addr1] = await viem.getWalletClients();
    const contract = await viem.deployContract("BaseNFT", ["Test NFT", "TNFT", "https://test.com/"]);

    try {
      await contract.write.mint([addr1.account.address], { account: addr1.account });
      expect.fail("Should have reverted");
    } catch (error: any) {
      expect(error.message).to.include("Not owner");
    }
  });
});

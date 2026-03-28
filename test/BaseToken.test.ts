import { expect } from "chai";
import { network } from "hardhat";
import { parseEther, getAddress } from "viem";

describe("BaseToken", function () {
  it("should set name and symbol correctly", async function () {
    const { viem } = await network.connect();
    const contract = await viem.deployContract("BaseToken", ["Test", "TST", 1000n]);

    expect(await contract.read.name()).to.equal("Test");
    expect(await contract.read.symbol()).to.equal("TST");
  });

  it("should mint initial supply to deployer", async function () {
    const { viem } = await network.connect();
    const [deployer] = await viem.getWalletClients();
    const contract = await viem.deployContract("BaseToken", ["Test", "TST", 1000n]);

    const expectedSupply = 1000n * 10n ** 18n;
    expect(await contract.read.totalSupply()).to.equal(expectedSupply);
    expect(await contract.read.balanceOf([deployer.account.address])).to.equal(expectedSupply);
  });

  it("should have 18 decimals", async function () {
    const { viem } = await network.connect();
    const contract = await viem.deployContract("BaseToken", ["Test", "TST", 1000n]);

    expect(await contract.read.decimals()).to.equal(18);
  });

  it("should transfer tokens between accounts", async function () {
    const { viem } = await network.connect();
    const [deployer, addr1] = await viem.getWalletClients();
    const contract = await viem.deployContract("BaseToken", ["Test", "TST", 1000n]);

    const amount = parseEther("100");
    await contract.write.transfer([addr1.account.address, amount]);

    expect(await contract.read.balanceOf([addr1.account.address])).to.equal(amount);
  });
});

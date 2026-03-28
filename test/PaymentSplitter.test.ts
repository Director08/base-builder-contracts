import { expect } from "chai";
import { network } from "hardhat";
import { parseEther, getAddress } from "viem";

describe("PaymentSplitter", function () {
  it("should set correct payee count", async function () {
    const { viem } = await network.connect();
    const [deployer, addr1] = await viem.getWalletClients();

    const contract = await viem.deployContract("PaymentSplitter", [
      [deployer.account.address, addr1.account.address],
      [80n, 20n],
    ]);

    expect(await contract.read.getPayeeCount()).to.equal(2n);
  });

  it("should record shares correctly", async function () {
    const { viem } = await network.connect();
    const [deployer, addr1] = await viem.getWalletClients();

    const contract = await viem.deployContract("PaymentSplitter", [
      [deployer.account.address, addr1.account.address],
      [80n, 20n],
    ]);

    expect(await contract.read.shares([deployer.account.address])).to.equal(80n);
    expect(await contract.read.shares([addr1.account.address])).to.equal(20n);
    expect(await contract.read.totalShares()).to.equal(100n);
  });

  it("should receive ETH", async function () {
    const { viem } = await network.connect();
    const [deployer, addr1] = await viem.getWalletClients();
    const publicClient = await viem.getPublicClient();

    const contract = await viem.deployContract("PaymentSplitter", [
      [deployer.account.address, addr1.account.address],
      [80n, 20n],
    ]);

    // Send ETH directly to the contract
    await deployer.sendTransaction({
      to: contract.address,
      value: parseEther("1"),
    });

    const balance = await publicClient.getBalance({ address: contract.address });
    expect(balance).to.equal(parseEther("1"));
  });
});

import { expect } from "chai";
import { network } from "hardhat";
import { parseEther, getAddress } from "viem";

describe("Vault", function () {
  it("should set admin to deployer", async function () {
    const { viem } = await network.connect();
    const [deployer] = await viem.getWalletClients();
    const contract = await viem.deployContract("Vault", []);

    expect(getAddress(await contract.read.admin())).to.equal(
      getAddress(deployer.account.address)
    );
  });

  it("should accept ETH deposits and track balance", async function () {
    const { viem } = await network.connect();
    const [deployer] = await viem.getWalletClients();
    const contract = await viem.deployContract("Vault", []);

    await contract.write.deposit([], { value: parseEther("0.01") });

    expect(await contract.read.balances([deployer.account.address])).to.equal(
      parseEther("0.01")
    );
    expect(await contract.read.totalDeposited()).to.equal(parseEther("0.01"));
  });

  it("should track deposit count", async function () {
    const { viem } = await network.connect();
    const [deployer] = await viem.getWalletClients();
    const contract = await viem.deployContract("Vault", []);

    await contract.write.deposit([], { value: parseEther("0.01") });
    await contract.write.deposit([], { value: parseEther("0.02") });

    expect(await contract.read.depositCount([deployer.account.address])).to.equal(2n);
  });

  it("should allow admin to pause", async function () {
    const { viem } = await network.connect();
    const contract = await viem.deployContract("Vault", []);

    expect(await contract.read.paused()).to.equal(false);

    await contract.write.setPaused([true]);
    expect(await contract.read.paused()).to.equal(true);
  });
});

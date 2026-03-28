import { expect } from "chai";
import { network } from "hardhat";
import { getAddress } from "viem";

describe("MultiSig", function () {
  it("should set owners correctly", async function () {
    const { viem } = await network.connect();
    const [deployer] = await viem.getWalletClients();

    const contract = await viem.deployContract("MultiSig", [
      [deployer.account.address],
      1n,
    ]);

    const owners = await contract.read.getOwners();
    expect(owners.length).to.equal(1);
    expect(getAddress(owners[0])).to.equal(getAddress(deployer.account.address));
  });

  it("should set required confirmations to 1", async function () {
    const { viem } = await network.connect();
    const [deployer] = await viem.getWalletClients();

    const contract = await viem.deployContract("MultiSig", [
      [deployer.account.address],
      1n,
    ]);

    expect(await contract.read.required()).to.equal(1n);
  });

  it("should allow owner to submit a transaction", async function () {
    const { viem } = await network.connect();
    const [deployer, addr1] = await viem.getWalletClients();

    const contract = await viem.deployContract("MultiSig", [
      [deployer.account.address],
      1n,
    ]);

    await contract.write.submit([addr1.account.address, 0n, "0x"]);
    expect(await contract.read.getTransactionCount()).to.equal(1n);
  });
});

import { expect } from "chai";
import { network } from "hardhat";
import { getAddress } from "viem";

describe("TimeLock", function () {
  it("should set admin to deployer", async function () {
    const { viem } = await network.connect();
    const [deployer] = await viem.getWalletClients();
    const contract = await viem.deployContract("TimeLock", []);

    expect(getAddress(await contract.read.admin())).to.equal(
      getAddress(deployer.account.address)
    );
  });

  it("should have MIN_DELAY of 3600 seconds", async function () {
    const { viem } = await network.connect();
    const contract = await viem.deployContract("TimeLock", []);

    expect(await contract.read.MIN_DELAY()).to.equal(3600n);
  });

  it("should have MAX_DELAY of 30 days", async function () {
    const { viem } = await network.connect();
    const contract = await viem.deployContract("TimeLock", []);

    const thirtyDays = 30n * 24n * 60n * 60n;
    expect(await contract.read.MAX_DELAY()).to.equal(thirtyDays);
  });
});

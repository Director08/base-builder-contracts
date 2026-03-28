import { expect } from "chai";
import { network } from "hardhat";
import { getAddress } from "viem";

describe("Staking", function () {
  it("should set staking token address", async function () {
    const { viem } = await network.connect();
    const token = await viem.deployContract("BaseToken", ["Stake Token", "STK", 1000000n]);
    const contract = await viem.deployContract("Staking", [
      token.address,
      token.address,
      1000000000000000n,
    ]);

    expect(getAddress(await contract.read.stakingToken())).to.equal(
      getAddress(token.address)
    );
  });

  it("should set reward token address", async function () {
    const { viem } = await network.connect();
    const token = await viem.deployContract("BaseToken", ["Stake Token", "STK", 1000000n]);
    const contract = await viem.deployContract("Staking", [
      token.address,
      token.address,
      1000000000000000n,
    ]);

    expect(getAddress(await contract.read.rewardToken())).to.equal(
      getAddress(token.address)
    );
  });

  it("should set reward rate", async function () {
    const { viem } = await network.connect();
    const token = await viem.deployContract("BaseToken", ["Stake Token", "STK", 1000000n]);
    const contract = await viem.deployContract("Staking", [
      token.address,
      token.address,
      1000000000000000n,
    ]);

    expect(await contract.read.rewardRate()).to.equal(1000000000000000n);
  });

  it("should set admin to deployer", async function () {
    const { viem } = await network.connect();
    const [deployer] = await viem.getWalletClients();
    const token = await viem.deployContract("BaseToken", ["Stake Token", "STK", 1000000n]);
    const contract = await viem.deployContract("Staking", [
      token.address,
      token.address,
      1000000000000000n,
    ]);

    expect(getAddress(await contract.read.admin())).to.equal(
      getAddress(deployer.account.address)
    );
  });
});

import { expect } from "chai";
import { network } from "hardhat";
import { getAddress } from "viem";

describe("SimpleDAO", function () {
  it("should set admin to deployer", async function () {
    const { viem } = await network.connect();
    const [deployer] = await viem.getWalletClients();
    const contract = await viem.deployContract("SimpleDAO", [604800n]);

    expect(getAddress(await contract.read.admin())).to.equal(
      getAddress(deployer.account.address)
    );
  });

  it("should set voting period", async function () {
    const { viem } = await network.connect();
    const contract = await viem.deployContract("SimpleDAO", [604800n]);

    expect(await contract.read.votingPeriod()).to.equal(604800n);
  });

  it("should allow admin to grant voting power", async function () {
    const { viem } = await network.connect();
    const [deployer, addr1] = await viem.getWalletClients();
    const contract = await viem.deployContract("SimpleDAO", [604800n]);

    await contract.write.grantVotingPower([addr1.account.address, 100n]);

    expect(await contract.read.votingPower([addr1.account.address])).to.equal(100n);
  });

  it("should start with zero proposals", async function () {
    const { viem } = await network.connect();
    const contract = await viem.deployContract("SimpleDAO", [604800n]);

    expect(await contract.read.proposalCount()).to.equal(0n);
  });
});

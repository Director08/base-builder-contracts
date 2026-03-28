import { expect } from "chai";
import { network } from "hardhat";
import { getAddress } from "viem";

describe("FeeRouter", function () {
  it("should set treasury address", async function () {
    const { viem } = await network.connect();
    const [deployer] = await viem.getWalletClients();

    const contract = await viem.deployContract("FeeRouter", [
      deployer.account.address,
      250n,
      50n,
    ]);

    expect(getAddress(await contract.read.treasury())).to.equal(
      getAddress(deployer.account.address)
    );
  });

  it("should set protocol fee bps correctly", async function () {
    const { viem } = await network.connect();
    const [deployer] = await viem.getWalletClients();

    const contract = await viem.deployContract("FeeRouter", [
      deployer.account.address,
      250n,
      50n,
    ]);

    expect(await contract.read.protocolFeeBps()).to.equal(250n);
    expect(await contract.read.referralFeeBps()).to.equal(50n);
  });

  it("should allow registration as referrer", async function () {
    const { viem } = await network.connect();
    const [deployer, addr1] = await viem.getWalletClients();

    const contract = await viem.deployContract("FeeRouter", [
      deployer.account.address,
      250n,
      50n,
    ]);

    expect(await contract.read.registeredReferrers([addr1.account.address])).to.equal(false);

    await contract.write.registerAsReferrer([], { account: addr1.account });

    expect(await contract.read.registeredReferrers([addr1.account.address])).to.equal(true);
  });
});

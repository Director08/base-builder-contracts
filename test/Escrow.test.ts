import { expect } from "chai";
import { network } from "hardhat";
import { parseEther, getAddress } from "viem";

describe("Escrow", function () {
  it("should start with deal count of 0", async function () {
    const { viem } = await network.connect();
    const contract = await viem.deployContract("Escrow", []);

    expect(await contract.read.dealCount()).to.equal(0n);
  });

  it("should create a deal with ETH", async function () {
    const { viem } = await network.connect();
    const [deployer, seller, arbiter] = await viem.getWalletClients();
    const contract = await viem.deployContract("Escrow", []);

    await contract.write.createDeal(
      [seller.account.address, arbiter.account.address, 500n],
      { value: parseEther("0.1") }
    );

    expect(await contract.read.dealCount()).to.equal(1n);

    const deal = await contract.read.deals([0n]);
    expect(getAddress(deal[0])).to.equal(getAddress(deployer.account.address)); // buyer
    expect(getAddress(deal[1])).to.equal(getAddress(seller.account.address)); // seller
    expect(deal[3]).to.equal(parseEther("0.1")); // amount
  });

  it("should increment deal count for each new deal", async function () {
    const { viem } = await network.connect();
    const [deployer, seller, arbiter] = await viem.getWalletClients();
    const contract = await viem.deployContract("Escrow", []);

    await contract.write.createDeal(
      [seller.account.address, arbiter.account.address, 500n],
      { value: parseEther("0.1") }
    );
    await contract.write.createDeal(
      [seller.account.address, arbiter.account.address, 200n],
      { value: parseEther("0.2") }
    );

    expect(await contract.read.dealCount()).to.equal(2n);
  });
});

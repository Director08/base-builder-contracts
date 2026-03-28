import { expect } from "chai";
import { network } from "hardhat";

describe("PaymentSplitter - Edge Cases", function () {
  it("should revert with mismatched arrays", async function () {
    const { viem } = await network.connect();
    const [deployer] = await viem.getWalletClients();
    await expect(
      viem.deployContract("PaymentSplitter", [[deployer.account.address], [80n, 20n]])
    ).to.be.rejectedWith("Length mismatch");
  });

  it("should revert with no payees", async function () {
    const { viem } = await network.connect();
    await expect(
      viem.deployContract("PaymentSplitter", [[], []])
    ).to.be.rejectedWith("No payees");
  });

  it("should revert with zero shares", async function () {
    const { viem } = await network.connect();
    const [deployer] = await viem.getWalletClients();
    await expect(
      viem.deployContract("PaymentSplitter", [[deployer.account.address], [0n]])
    ).to.be.rejectedWith("Zero shares");
  });
});

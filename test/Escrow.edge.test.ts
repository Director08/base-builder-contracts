import { expect } from "chai";
import { network } from "hardhat";
import { parseEther } from "viem";

describe("Escrow - Edge Cases", function () {
  it("should revert creating deal with zero value", async function () {
    const { viem } = await network.connect();
    const [, seller, arbiter] = await viem.getWalletClients();
    const escrow = await viem.deployContract("Escrow");
    await expect(
      escrow.write.createDeal([seller.account.address, arbiter.account.address, 500n], { value: 0n })
    ).to.be.rejectedWith("Must fund deal");
  });

  it("should revert release by non-buyer", async function () {
    const { viem } = await network.connect();
    const [buyer, seller, arbiter] = await viem.getWalletClients();
    const escrow = await viem.deployContract("Escrow");
    await escrow.write.createDeal(
      [seller.account.address, arbiter.account.address, 500n],
      { value: parseEther("0.01") }
    );
    await expect(
      escrow.write.release([0n], { account: seller.account })
    ).to.be.rejectedWith("Only buyer");
  });
});

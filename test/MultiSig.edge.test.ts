import { expect } from "chai";
import { network } from "hardhat";

describe("MultiSig - Edge Cases", function () {
  it("should revert with zero owners", async function () {
    const { viem } = await network.connect();
    await expect(
      viem.deployContract("MultiSig", [[], 1n])
    ).to.be.rejectedWith("Need owners");
  });

  it("should revert with required > owners", async function () {
    const { viem } = await network.connect();
    const [deployer] = await viem.getWalletClients();
    await expect(
      viem.deployContract("MultiSig", [[deployer.account.address], 2n])
    ).to.be.rejectedWith("Invalid required count");
  });

  it("should revert non-owner submit", async function () {
    const { viem } = await network.connect();
    const [deployer, nonOwner] = await viem.getWalletClients();
    const multisig = await viem.deployContract("MultiSig", [[deployer.account.address], 1n]);
    await expect(
      multisig.write.submit(
        ["0x0000000000000000000000000000000000000001", 0n, "0x"],
        { account: nonOwner.account }
      )
    ).to.be.rejectedWith("Not owner");
  });
});

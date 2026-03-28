import { expect } from "chai";
import { network } from "hardhat";
import { parseEther } from "viem";

describe("Vault - Edge Cases", function () {
  it("should revert zero deposit", async function () {
    const { viem } = await network.connect();
    const vault = await viem.deployContract("Vault");
    await expect(
      vault.write.deposit({ value: 0n })
    ).to.be.rejectedWith("Zero deposit");
  });

  it("should revert withdraw when paused", async function () {
    const { viem } = await network.connect();
    const vault = await viem.deployContract("Vault");
    await vault.write.deposit({ value: parseEther("0.01") });
    await vault.write.setPaused([true]);
    await expect(
      vault.write.withdraw([parseEther("0.01")])
    ).to.be.rejectedWith("Vault is paused");
  });

  it("should revert withdrawAll with no balance", async function () {
    const { viem } = await network.connect();
    const vault = await viem.deployContract("Vault");
    await expect(
      vault.write.withdrawAll()
    ).to.be.rejectedWith("Nothing to withdraw");
  });
});

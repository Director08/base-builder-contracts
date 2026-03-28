import { expect } from "chai";
import { network } from "hardhat";

describe("FeeRouter - Edge Cases", function () {
  it("should revert fees totaling over 100%", async function () {
    const { viem } = await network.connect();
    const [deployer] = await viem.getWalletClients();
    await expect(
      viem.deployContract("FeeRouter", [deployer.account.address, 9000n, 2000n])
    ).to.be.rejectedWith("Fees too high");
  });

  it("should revert routeFee with zero value", async function () {
    const { viem } = await network.connect();
    const [deployer] = await viem.getWalletClients();
    const router = await viem.deployContract("FeeRouter", [deployer.account.address, 250n, 50n]);
    await expect(
      router.write.routeFee(["0x0000000000000000000000000000000000000000"], { value: 0n })
    ).to.be.rejectedWith("No value");
  });
});

import { expect } from "chai";
import { network } from "hardhat";

describe("TimeLock - Edge Cases", function () {
  it("should revert non-admin queue", async function () {
    const { viem } = await network.connect();
    const [, nonAdmin] = await viem.getWalletClients();
    const timelock = await viem.deployContract("TimeLock");
    const futureTime = BigInt(Math.floor(Date.now() / 1000)) + 7200n;
    await expect(
      timelock.write.queue(
        ["0x0000000000000000000000000000000000000001", 0n, "0x", futureTime],
        { account: nonAdmin.account }
      )
    ).to.be.rejectedWith("Not admin");
  });

  it("should revert cancel on non-queued tx", async function () {
    const { viem } = await network.connect();
    const timelock = await viem.deployContract("TimeLock");
    const fakeTxId = "0x0000000000000000000000000000000000000000000000000000000000000001";
    await expect(
      timelock.write.cancel([fakeTxId])
    ).to.be.rejectedWith("Not queued");
  });
});

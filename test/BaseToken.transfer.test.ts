import { expect } from "chai";
import { network } from "hardhat";

describe("BaseToken - Transfer Edge Cases", function () {
  it("should revert transfer to zero address", async function () {
    const { viem } = await network.connect();
    const token = await viem.deployContract("BaseToken", ["Test", "TST", 100n]);
    await expect(
      token.write.transfer(["0x0000000000000000000000000000000000000000", 1n])
    ).to.be.rejectedWith("ERC20: transfer to zero");
  });

  it("should revert on insufficient balance", async function () {
    const { viem } = await network.connect();
    const [, addr1] = await viem.getWalletClients();
    const token = await viem.deployContract("BaseToken", ["Test", "TST", 100n]);
    await expect(
      token.write.transfer(["0x0000000000000000000000000000000000000001", 1n], {
        account: addr1.account,
      })
    ).to.be.rejectedWith("ERC20: insufficient balance");
  });
});

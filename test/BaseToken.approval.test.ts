import { expect } from "chai";
import { network } from "hardhat";

describe("BaseToken - Approval and TransferFrom", function () {
  it("should approve spender", async function () {
    const { viem } = await network.connect();
    const [deployer, spender] = await viem.getWalletClients();
    const token = await viem.deployContract("BaseToken", ["Test", "TST", 100n]);
    await token.write.approve([spender.account.address, 50n * 10n ** 18n]);
    const allowance = await token.read.allowance([deployer.account.address, spender.account.address]);
    expect(allowance).to.equal(50n * 10n ** 18n);
  });

  it("should transferFrom with allowance", async function () {
    const { viem } = await network.connect();
    const [deployer, spender] = await viem.getWalletClients();
    const token = await viem.deployContract("BaseToken", ["Test", "TST", 100n]);
    await token.write.approve([spender.account.address, 10n * 10n ** 18n]);
    await token.write.transferFrom(
      [deployer.account.address, spender.account.address, 5n * 10n ** 18n],
      { account: spender.account }
    );
    const balance = await token.read.balanceOf([spender.account.address]);
    expect(balance).to.equal(5n * 10n ** 18n);
  });
});

import { expect } from "chai";
import { network } from "hardhat";

describe("SimpleDAO - Edge Cases", function () {
  it("should revert propose without voting power", async function () {
    const { viem } = await network.connect();
    const [, noVotingPower] = await viem.getWalletClients();
    const dao = await viem.deployContract("SimpleDAO", [604800n]);
    await expect(
      dao.write.propose(["Test proposal"], { account: noVotingPower.account })
    ).to.be.rejectedWith("No voting power");
  });

  it("should revert non-admin granting voting power", async function () {
    const { viem } = await network.connect();
    const [, nonAdmin] = await viem.getWalletClients();
    const dao = await viem.deployContract("SimpleDAO", [604800n]);
    await expect(
      dao.write.grantVotingPower([nonAdmin.account.address, 100n], { account: nonAdmin.account })
    ).to.be.rejectedWith("Not admin");
  });
});

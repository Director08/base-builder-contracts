import { expect } from "chai";
import { network } from "hardhat";
import { getAddress } from "viem";

describe("AirdropDistributor", function () {
  it("should set admin to deployer", async function () {
    const { viem } = await network.connect();
    const [deployer] = await viem.getWalletClients();
    const contract = await viem.deployContract("AirdropDistributor", []);

    expect(getAddress(await contract.read.admin())).to.equal(
      getAddress(deployer.account.address)
    );
  });

  it("should allow batch ETH transfer", async function () {
    const { viem } = await network.connect();
    const [deployer, addr1, addr2] = await viem.getWalletClients();
    const publicClient = await viem.getPublicClient();
    const contract = await viem.deployContract("AirdropDistributor", []);

    const balanceBefore = await publicClient.getBalance({ address: addr1.account.address });

    await contract.write.batchTransferETH(
      [[addr1.account.address, addr2.account.address], [1000n, 2000n]],
      { value: 3000n }
    );

    const balanceAfter = await publicClient.getBalance({ address: addr1.account.address });
    expect(balanceAfter - balanceBefore).to.equal(1000n);
  });
});

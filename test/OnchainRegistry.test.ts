import { expect } from "chai";
import { network } from "hardhat";
import { getAddress } from "viem";

describe("OnchainRegistry", function () {
  it("should register a key-value pair", async function () {
    const { viem } = await network.connect();
    const [deployer] = await viem.getWalletClients();
    const contract = await viem.deployContract("OnchainRegistry", []);

    await contract.write.register(["mykey", "myvalue"]);

    const result = await contract.read.lookup(["mykey"]);
    expect(result[0]).to.equal("myvalue");
    expect(getAddress(result[1])).to.equal(getAddress(deployer.account.address));
  });

  it("should return correct value on lookup", async function () {
    const { viem } = await network.connect();
    const contract = await viem.deployContract("OnchainRegistry", []);

    await contract.write.register(["project", "base-builder"]);

    const result = await contract.read.lookup(["project"]);
    expect(result[0]).to.equal("base-builder");
  });

  it("should not allow non-owner to update a key", async function () {
    const { viem } = await network.connect();
    const [deployer, addr1] = await viem.getWalletClients();
    const contract = await viem.deployContract("OnchainRegistry", []);

    const tx = await contract.write.register(["mykey", "myvalue"]);
    const publicClient = await viem.getPublicClient();

    // Get the keyHash from lookup
    const result = await contract.read.lookup(["mykey"]);
    const keyHash = await contract.read.userKeys([deployer.account.address, 0n]);

    try {
      await contract.write.update([keyHash, "newvalue"], { account: addr1.account });
      expect.fail("Should have reverted");
    } catch (error: any) {
      expect(error.message).to.include("Not key owner");
    }
  });
});

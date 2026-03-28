import { expect } from "chai";
import { network } from "hardhat";
import { getAddress, zeroAddress } from "viem";

describe("CloneFactory", function () {
  it("should clone a contract", async function () {
    const { viem } = await network.connect();
    const publicClient = await viem.getPublicClient();

    // Deploy implementation contract
    const implementation = await viem.deployContract("OnchainRegistry", []);

    // Deploy CloneFactory
    const factory = await viem.deployContract("CloneFactory", []);

    // Clone the implementation
    const hash = await factory.write.clone([implementation.address]);
    const receipt = await publicClient.waitForTransactionReceipt({ hash });

    // Verify clone was created by checking the event logs
    expect(receipt.logs.length).to.be.greaterThan(0);
  });

  it("should create deterministic clone at predicted address", async function () {
    const { viem } = await network.connect();
    const publicClient = await viem.getPublicClient();

    const implementation = await viem.deployContract("OnchainRegistry", []);
    const factory = await viem.deployContract("CloneFactory", []);

    const salt = "0x0000000000000000000000000000000000000000000000000000000000000001" as `0x${string}`;

    // Predict address
    const predicted = await factory.read.predictDeterministicAddress([
      implementation.address,
      salt,
    ]);

    // Deploy deterministic clone
    const hash = await factory.write.cloneDeterministic([implementation.address, salt]);
    await publicClient.waitForTransactionReceipt({ hash });

    // Verify code exists at predicted address
    const code = await publicClient.getCode({ address: predicted });
    expect(code).to.not.equal("0x");
    expect(code!.length).to.be.greaterThan(2);
  });
});

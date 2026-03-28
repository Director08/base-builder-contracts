import { expect } from "chai";
import { network } from "hardhat";

describe("BaseNFT - Edge Cases", function () {
  it("should revert tokenURI for nonexistent token", async function () {
    const { viem } = await network.connect();
    const nft = await viem.deployContract("BaseNFT", ["Test", "TNFT", "https://test.com/"]);
    await expect(nft.read.tokenURI([999n])).to.be.rejectedWith("Token does not exist");
  });

  it("should allow owner to set base URI", async function () {
    const { viem } = await network.connect();
    const nft = await viem.deployContract("BaseNFT", ["Test", "TNFT", "https://old.com/"]);
    await nft.write.setBaseURI(["https://new.com/"]);
    const newURI = await nft.read.baseURI();
    expect(newURI).to.equal("https://new.com/");
  });
});

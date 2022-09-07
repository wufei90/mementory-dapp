const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");
const { BigNumber } = require("ethers");
const tokenURI =
  "ipfs://bafybeibzeicfs3vgdcafrfanbrz2zn7aktcndiqksoie27oyyz7ztmhh6a/1.json";
const tokenURI_2 =
  "ipfs://bafybeibzeicfs3vgdcafrfanbrz2zn7aktcndiqksoie27oyyz7ztmhh6a/2.json";

describe("Mementory Contract", function () {
  async function deployFixture() {
    const [owner, holder, externalUser] = await ethers.getSigners();

    const NFT = await ethers.getContractFactory("Mementory");
    const nft = await NFT.deploy("Mementory", "MMTRY");
    await nft.deployed();

    return { nft, owner, holder, externalUser };
  }

  it("Should set the right owner", async function () {
    const { nft, owner } = await loadFixture(deployFixture);
    expect(await nft.owner()).to.equal(owner.address);
  });

  it("Should be able to mint", async function () {
    const { nft, holder } = await loadFixture(deployFixture);
    // Initial balance = 0
    expect(await nft.balanceOf(await holder.getAddress())).to.equal(0);
    await nft.connect(holder).createToken(tokenURI);
    expect(await nft.balanceOf(await holder.getAddress())).to.equal(1);
    expect(await nft.tokenURI(1)).to.equal(tokenURI);
  });

  it("Should be able to retrieve a wallet's tokens", async function () {
    const { nft, holder } = await loadFixture(deployFixture);
    // Mint two tokens
    await nft.connect(holder).createToken(tokenURI);
    await nft.connect(holder).createToken(tokenURI_2);
    const currentBalance = await nft.balanceOf(await holder.getAddress());
    expect(currentBalance).to.equal(2);
    // Retrieve all tokens of the wallet
    const tokenIds = [];
    for (let i = 0; i < currentBalance; i++) {
      tokenIds.push(
        await nft.tokenOfOwnerByIndex(await holder.getAddress(), i)
      );
    }
    expect(tokenIds[0]).to.equal(1);
    expect(tokenIds[1]).to.equal(2);
  });

  it("Should be able to burn", async function () {
    const { nft, holder } = await loadFixture(deployFixture);
    // Mint two tokens
    await nft.connect(holder).createToken(tokenURI);
    await nft.connect(holder).createToken(tokenURI_2);
    const address = await holder.getAddress();
    expect(await nft.balanceOf(address)).to.equal(2);
    // Burn the second token
    await nft.connect(holder).burnToken(2);
    expect(await nft.balanceOf(address)).to.equal(1);
    await expect(nft.tokenURI(2)).to.be.revertedWith(
      "ERC721: invalid token ID"
    );
    // First token should be untouched
    expect(await nft.tokenOfOwnerByIndex(address, 0)).to.equal(1);
    // Another mint will resume from last counter position
    await nft.connect(holder).createToken(tokenURI_2);
    expect(await nft.tokenOfOwnerByIndex(address, 1)).to.equal(3);
  });

  it("External user should not be able to burn", async function () {
    const { nft, holder, externalUser } = await loadFixture(deployFixture);
    // Mint
    await nft.connect(holder).createToken(tokenURI);
    const address = await holder.getAddress();
    expect(await nft.balanceOf(address)).to.equal(1);
    // Burn the second token
    await expect(nft.connect(externalUser).burnToken(1)).to.revertedWith(
      "Only the owner of the token can burn it"
    );
    expect(await nft.balanceOf(address)).to.equal(1);
  });
});

const hre = require("hardhat");

async function main() {
  const NFT = await hre.ethers.getContractFactory("Mementory");
  const nft = await NFT.deploy("Mementory", "MMTRY");
  await nft.deployed();
  console.log("Contract deployed to:", nft.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

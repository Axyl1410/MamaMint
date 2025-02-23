const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    // // Deploy MyNFTCollection
    // const MyNFTCollection = await hre.ethers.getContractFactory("MyNFTCollection");
    // const myNFTCollection = await MyNFTCollection.deploy();
    // await myNFTCollection.waitForDeployment();
    //
    // console.log("MyNFTCollection deployed to:", await myNFTCollection.getAddress());

    // Deploy NFTMarketplace
    const NFTMarketplace = await hre.ethers.getContractFactory("NFTMarketplace");
    const nftMarketplace = await NFTMarketplace.deploy(deployer.address, deployer.address); // Pass feeRecipient address
    await nftMarketplace.waitForDeployment({
        value: hre.ethers.parseEther("0.1"),
    });

    console.log("NFTMarketplace deployed to:", await nftMarketplace.getAddress());

    // // Set approval for the marketplace to manage NFTs on behalf of the NFTDropPlatform
    // const marketplaceAddress = await nftMarketplace.getAddress();
    // const tx = await myNFTCollection.setApprovalForAll(marketplaceAddress, true);
    // await tx.wait(); // Wait for the transaction to be mined
    //
    // console.log(`Approval granted to marketplace (${marketplaceAddress}) to manage NFTs from NFTDropPlatform.`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
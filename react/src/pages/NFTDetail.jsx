import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import CollectionContract from "../contracts/GenerativeArtNFT.json";
import NFTMarketplaceABI from "../contracts/NFTMarketplace.json";

const NFT_MARKETPLACE_ADDRESS = "0x2724E15525a01635dcbb49E4665851d06919A03e";

const NFTDetail = () => {
    const [nft, setNft] = useState(null);
    const [account, setAccount] = useState(null);
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [contract, setContract] = useState(null);
    const [price, setPrice] = useState(0.1);

    const { contractAddress, tokenId } = useParams();

    useEffect(() => {
        const initEthers = async () => {
            if (window.ethereum) {
                await window.ethereum.request({ method: "eth_requestAccounts" });
                const provider = new ethers.BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();
                setProvider(provider);
                setSigner(signer);
                setAccount(await signer.getAddress());
            } else {
                console.error("MetaMask not found. Please install MetaMask.");
            }

        };
        initEthers();
    }, []);

    useEffect(() => {
        const fetchTokenData = async () => {
            if (!signer || !contractAddress || !tokenId) return;
            try {
                const nftContract = new ethers.Contract(contractAddress, CollectionContract.abi, signer);
                const tokenUri = await nftContract.tokenURI(tokenId);

                // Decode Base64 JSON metadata
                const base64Json = tokenUri.replace("data:application/json;base64,", "");
                const jsonMetadata = JSON.parse(atob(base64Json));

                const ownerAddress = await nftContract.ownerOf(tokenId);

                setNft({
                    ...jsonMetadata,
                    tokenId,
                    collectionId: { contractAddress },
                    ownerAddress,
                    isListed: false,
                });

                setContract(nftContract);
            } catch (error) {
                console.error("Failed to fetch tokenURI:", error);
            }
        };
        fetchTokenData();
    }, [signer, contractAddress, tokenId]);

    const handleListNFT = async () => {
        if (!nft || !account || !contract) return;
        try {
            const priceInWei = ethers.parseEther(price.toString());

            // 1️⃣ Kiểm tra quyền approve cho marketplace
            const isApproved = await contract.isApprovedForAll(account, NFT_MARKETPLACE_ADDRESS);
            if (!isApproved) {
                console.log("Approving all NFTs for marketplace...");
                const approveTx = await contract.setApprovalForAll(NFT_MARKETPLACE_ADDRESS, true);
                await approveTx.wait();
                console.log("Approval successful.");
            }

            // ✅ 2️⃣ Tạo instance marketplace contract và gọi listNFTFixedPrice
            const marketplaceContract = new ethers.Contract(
                NFT_MARKETPLACE_ADDRESS,
                NFTMarketplaceABI.abi,
                signer
            );

            console.log("Listing NFT on marketplace...");
            const listTx = await marketplaceContract.listNFTFixedPrice(
                nft.collectionId.contractAddress,
                nft.tokenId,
                priceInWei,
                { gasLimit: 500000 }
            );
            await listTx.wait();
            console.log("✅ NFT listed successfully on blockchain.");

            // 3️⃣ Lưu thông tin listing vào backend
            const listingData = {
                nftContract: contractAddress,
                tokenMetadata: nft,
                seller: account,
                price: price,
                type: "fixed",
                status: "active",
            };
            console.log("listingData", listingData);

            const response = await fetch("http://localhost:8080/api/marketplace/listing", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(listingData),
            });

            if (!response.ok) throw new Error("Failed to save listing to backend.");

            setNft({ ...nft, isListed: true });
            alert("🎉 NFT listed successfully on marketplace!");
        } catch (error) {
            console.error("❌ Error listing NFT on blockchain:", error);
            alert("Failed to list NFT on blockchain.");
        }
    };

    if (!nft) return <p className="text-center text-gray-500">Loading...</p>;

    const imageUrl = nft.image ? nft.image.replace("ipfs://", "https://ipfs.io/ipfs/") : "";

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md my-10 z-[50]">
            {imageUrl && <img src={imageUrl} alt={nft.name} className="w-full h-80 object-cover rounded-lg" />}
            <h2 className="text-2xl font-bold mt-4">{nft.name}</h2>
            <p className="text-gray-600 mt-2">{nft.description}</p>
            <div className="mt-4 p-4 border rounded-lg">
                <p className="text-gray-700">Collection: <span className="font-semibold">{contractAddress}</span></p>
                <p className="text-gray-700">Owner: <span className="font-mono">{nft.ownerAddress}</span></p>
                <p className="text-gray-700">Listed: <span className={nft.isListed ? "text-green-600" : "text-red-600"}>{nft.isListed ? "Yes" : "No"}</span></p>
            </div>
            <div className="mt-4">
                <h3 className="text-xl font-semibold">Attributes</h3>
                <ul className="mt-2">
                    {nft.attributes && nft.attributes.map((attr, index) => (
                        <li key={index} className="text-gray-700">
                            <strong>{attr.trait_type}:</strong> {attr.value}
                        </li>
                    ))}
                </ul>
            </div>
            {nft.ownerAddress === account && (
                <div className="mt-4">
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="border p-2 rounded w-full mb-2"
                        placeholder="Enter price in ETH"
                    />
                    <button onClick={handleListNFT} className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
                        {nft.isListed ? "NFT Listed" : "List NFT"}
                    </button>
                </div>
            )}
        </div>
    );
};

export default NFTDetail;

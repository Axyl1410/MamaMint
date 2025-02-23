import { useEffect, useState } from "react";
import Web3 from "web3";
import contractABI from '../contracts/Collection.json';
import {ethers} from "ethers";

export default function CreateNFT() {
    const [collections, setCollections] = useState([]);
    const [selectedCollection, setSelectedCollection] = useState("");
    const [nftData, setNftData] = useState({ name: "", description: "", image: null });
    const [traits, setTraits] = useState([{ traitType: "", value: "" }]);
    const [account, setAccount] = useState(null);
    const [nftContract, setNftContract] = useState(null);

    useEffect(() => {
        const connectWallet = async () => {
            if (window.ethereum) {
                try {
                    const web3Instance = new Web3(window.ethereum);
                    const accounts = await web3Instance.eth.requestAccounts();
                    setAccount(accounts[0]);
                    console.log("Connected Account:", accounts[0]);

                    // Fetch collections after connecting
                    fetchCollections(accounts[0]);

                } catch (error) {
                    console.error("Error connecting to wallet:", error);
                }
            } else {
                console.log('MetaMask Not Available');
            }
        };

        connectWallet();
    }, [account]);

    useEffect(() => {
        if (selectedCollection && account) {
            const web3Instance = new Web3(window.ethereum);
            const contractInstance = new web3Instance.eth.Contract(contractABI.abi, selectedCollection);
            setNftContract(contractInstance);
            console.log("Connected to contract:", contractInstance);
        }
    }, [selectedCollection, account]);

    const fetchCollections = async (connectedAccount) => {
        if (connectedAccount) {
            try {
                const response = await fetch(`http://localhost:8080/api/collections/wallet/${connectedAccount}`);
                const data = await response.json();
                const collectionsArray = Array.isArray(data) ? data : [data];
                setCollections(collectionsArray);
            } catch (error) {
                console.error("Error fetching collections:", error);
            }
        }
    };

    const addTrait = () => {
        setTraits([...traits, { traitType: "", value: "" }]);
    };

    const updateTrait = (index, field, value) => {
        const updatedTraits = [...traits];
        updatedTraits[index][field] = value;
        setTraits(updatedTraits);
    };

    const handleImageChange = (e) => {
        setNftData({ ...nftData, image: e.target.files[0] });
    };

    const handleSubmit = async () => {
        if (!account) {
            alert("Please connect your wallet first.");
            return;
        }

        if (!nftContract) {
            alert("Please select a collection.");
            return;
        }

        const attributes = JSON.stringify(traits);

        try {
            const result = await nftContract.methods.mint(nftData.name, nftData.description, attributes).send({
                from: account,
                gas: 300000, // Set a higher gas limit
            });
            console.log("Minting result:", result);
            alert("NFT minted successfully!");

            const tokenId = await nftContract.methods.totalSupply().call();
            console.log("Minted Token ID:", Number(tokenId));


            const token = {
                name: nftData.name,
                description: nftData.description,
                image: "ipfs://bafkreifboav3uilgtewd2fqaititaqc76onxkamx4wu535asbi56idl2im",
                attributes: attributes,
                collectionId: selectedCollection,
                tokenId: Number(tokenId),
                ownerAddress: account,
            };

            console.log(token)

            const response = await fetch("http://localhost:8080/api/nfts/mint/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(token),
            });
            const data = await response.json();
            console.log("NFT created:", data);

            // Reset the form after successful minting
            setNftData({ name: "", description: "", image: null });
            setTraits([{ traitType: "", value: "" }]);

        } catch (error) {
            console.error("Error minting NFT:", error);
            alert("Error minting NFT. Please check the console for details.");
        }
    };

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Create NFT</h1>
            {/* Collection Selection */}
            <div className="mb-4">
                <label className="block mb-1">Select Collection</label>
                <select
                    className="border p-2 w-full"
                    onChange={(e) => setSelectedCollection(e.target.value)}
                >
                    <option value="">Select Collection</option>
                    {collections?.map((col) => (
                        <option key={col._id} value={col.contractAddress}>
                            {col.collectionName}
                        </option>
                    ))}
                </select>
            </div>
            {/* NFT Details */}
            <div className="mb-4">
                <input
                    className="border p-2 w-full mb-2"
                    placeholder="NFT Name"
                    value={nftData.name}
                    onChange={(e) => setNftData({ ...nftData, name: e.target.value })}
                />
                <input
                    className="border p-2 w-full mb-2"
                    placeholder="Description"
                    value={nftData.description}
                    onChange={(e) => setNftData({ ...nftData, description: e.target.value })}
                />
                <input
                    type="file"
                    className="border p-2 w-full"
                    onChange={handleImageChange}
                />
            </div>
            {/* Traits Section */}
            <div className="mt-6">
                <h2 className="text-lg font-semibold">Traits</h2>
                {traits.map((trait, index) => (
                    <div key={index} className="flex space-x-2 mt-2">
                        <input
                            className="border p-2 w-full"
                            placeholder="Trait Type"
                            value={trait.traitType}
                            onChange={(e) => updateTrait(index, "traitType", e.target.value)}
                        />
                        <input
                            className="border p-2 w-full"
                            placeholder="Value"
                            value={trait.value}
                            onChange={(e) => updateTrait(index, "value", e.target.value)}
                        />
                    </div>
                ))}
                <button className="mt-2 bg-gray-200 p-2 rounded" onClick={addTrait}>
                    + Add Trait
                </button>
            </div>
            {/* Submit Button */}
            <button className="mt-6 w-full bg-blue-500 text-white p-3 rounded" onClick={handleSubmit}>
                Create NFT
            </button>
        </div>
    );
}
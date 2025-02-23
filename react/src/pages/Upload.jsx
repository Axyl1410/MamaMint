import {useState} from "react";
import {ethers} from "ethers";
import {
    faImage,
    faRocket,
} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import contractABI from '../contracts/Collection.json'

import {PinataSDK} from "pinata-web3"

export const pinata = new PinataSDK({
    pinataJwt: process.env.REACT_APP_PINATA_JWT,
    pinataGateway: process.env.REACT_APP_PINATA_GATEWAY
})


export default function CreateDropCollection() {
    const [collectionName, setCollectionName] = useState("");
    const [collectionSymbol, setCollectionSymbol] = useState("");
    const [description, setDescription] = useState("");
    const [artwork, setArtwork] = useState(null);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [unlimitedTime, setUnlimitedTime] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    // New state variables for parameters
    const [maxSupply, setMaxSupply] = useState(100);
    const [price, setPrice] = useState("0.01");
    const [maxPerWallet, setMaxPerWallet] = useState(5);

    // State variables for additional metadata
    const [externalUrl, setExternalUrl] = useState("");
    const [attributes, setAttributes] = useState([
        {trait_type: "", value: ""}, // Default empty attribute
    ]);

    // Handle file upload
    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setArtwork(file);
        }
    };

    // Handle adding a new attribute
    const addAttribute = () => {
        setAttributes([...attributes, {trait_type: "", value: ""}]);
    };

    // Handle updating an attribute
    const updateAttribute = (index, field, value) => {
        const updatedAttributes = [...attributes];
        updatedAttributes[index][field] = value;
        setAttributes(updatedAttributes);
    };

    // Handle removing an attribute
    const removeAttribute = (index) => {
        const updatedAttributes = attributes.filter((_, i) => i !== index);
        setAttributes(updatedAttributes);
    };

    // Upload metadata and artwork to IPFS using Pinata
    const uploadToIPFS = async () => {
        if (!artwork || !collectionName || !description) {
            alert("Please fill all fields and upload artwork.");
            return;
        }

        setIsLoading(true);

        try {
            // Upload artwork to Pinata
            const artworkFormData = new FormData();
            artworkFormData.append("file", artwork);

            const artworkUpload = await pinata.upload.file(artwork);
            console.log("Artwork Upload:", artworkUpload);
            const artworkURL = `https://gateway.pinata.cloud/ipfs/${artworkUpload.IpfsHash}`;

            // Create metadata JSON
            const metadata = {
                name: collectionName,
                description: description,
                image: artworkURL,
                external_url: externalUrl || "https://example.com", // Use user input or default
                attributes: attributes.filter(
                    (attr) => attr.trait_type && attr.value
                ), // Filter out empty attributes
            };

            const json = new File([JSON.stringify(metadata)], "metadata.json", {
                type: "application/json",
            });

            // Upload metadata to Pinata
            const metadataUpload = await pinata.upload.file(json);
            console.log("Metadata Upload:", metadataUpload);
            const metadataURL = `https://gateway.pinata.cloud/ipfs/${metadataUpload.IpfsHash}`;

            setIsLoading(false);
            return metadataURL;
        } catch (error) {
            console.error("Error uploading to Pinata:", error);
            setIsLoading(false);
            return null;
        }
    };

    const deploy = async () => {
        // const metadataURL = await uploadToIPFS(); // Upload metadata and artwork to IPFS
        const metadataURL = "https://gateway.pinata.cloud/ipfs/bafkreihpyqxtkka7qlibasvqypj7sqlmlalqrfaaqmq4iwqeibglsuyu7i"
        if (!metadataURL) {
            alert("Failed to upload metadata to IPFS.");
            return;
        }

        try {
            // Ensure MetaMask is installed
            if (!window.ethereum) {
                alert("MetaMask is not installed!");
                return;
            }

            const accounts = await window.ethereum.request({method: "eth_accounts"});

            // Request the user's MetaMask account
            await window.ethereum.request({method: "eth_requestAccounts"});

            // Create an Ethereum provider and signer (MetaMask)
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner(); // Get the MetaMask signer (user's account)

            // Contract details
            const contractFactory = new ethers.ContractFactory(
                contractABI.abi, // ABI of your contract
                contractABI.bytecode, // Bytecode of your contract (from compilation)
                signer // The signer (account) used for deploying
            );

            // Deploy the contract with constructor arguments
            const transaction = await contractFactory.deploy(
                collectionName, // Collection name
                collectionSymbol, // Token symbol
            );

            // Wait for the deployment transaction to be mined
            const transactionReceipt = await transaction.deploymentTransaction().wait(); // Wait for the transaction to be mined

            if (transactionReceipt.status === 1) {
                const collectionData = {
                    collectionName,
                    collectionSymbol,
                    description,
                    artworkURL: metadataURL, // URL from IPFS
                    externalUrl,
                    userAddress: accounts[0],
                    contractAddress: transactionReceipt.contractAddress,
                };
                const response = await fetch('http://localhost:8080/api/collections/create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(collectionData),
                });

                const data = await response.json();
                console.log("Collection created:", data);
                alert("Collection created successfully!");
            }
        } catch (error) {
            console.error("Error deploying contract:", error);
            alert("Failed to deploy contract. Check the console for details.");
        }
    };


    return (
        <div className="mx-auto p-8">
            Upload
            <h1 className="text-4xl font-bold mb-8">Edition</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">
                            Collection name
                        </label>
                        <input
                            type="text"
                            className="w-full border rounded-lg p-4"
                            placeholder="Name"
                            value={collectionName}
                            onChange={(e) => setCollectionName(e.target.value)}
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">
                            Collection Symbol
                        </label>
                        <input
                            type="text"
                            className="w-full border rounded-lg p-4"
                            placeholder="Symbol"
                            value={collectionSymbol}
                            onChange={(e) => setCollectionSymbol(e.target.value)}
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">
                            Description
                        </label>
                        <textarea
                            className="w-full border rounded-lg p-4"
                            rows="4"
                            placeholder="This description will appear publicly in places like marketplaces, third-party apps, and more. Use plaintext or markdown."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        ></textarea>
                    </div>

                    {/* External URL */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">
                            External URL
                        </label>
                        <input
                            type="text"
                            className="w-full border rounded-lg p-4"
                            placeholder="https://example.com"
                            value={externalUrl}
                            onChange={(e) => setExternalUrl(e.target.value)}
                        />
                    </div>

                    {/* Attributes */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">
                            Attributes (Traits)
                        </label>
                        {attributes.map((attr, index) => (
                            <div key={index} className="flex space-x-4 mb-4">
                                <input
                                    type="text"
                                    className="w-1/2 border rounded-lg p-4"
                                    placeholder="Trait Type (e.g., Color)"
                                    value={attr.trait_type}
                                    onChange={(e) =>
                                        updateAttribute(index, "trait_type", e.target.value)
                                    }
                                />
                                <input
                                    type="text"
                                    className="w-1/2 border rounded-lg p-4"
                                    placeholder="Value (e.g., Red)"
                                    value={attr.value}
                                    onChange={(e) =>
                                        updateAttribute(index, "value", e.target.value)
                                    }
                                />
                                <button
                                    className="bg-red-500 text-white py-2 px-4 rounded-md"
                                    onClick={() => removeAttribute(index)}
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                        <button
                            className="bg-black text-white py-2 px-4 rounded-md"
                            onClick={addAttribute}
                        >
                            Add Attribute
                        </button>
                    </div>

                    {/* New input fields for parameters */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">
                            Max Supply
                        </label>
                        <input
                            type="number"
                            className="w-full border rounded-lg p-4"
                            placeholder="Max Supply"
                            value={maxSupply}
                            onChange={(e) => setMaxSupply(Number(e.target.value))}
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">
                            Price (ETH)
                        </label>
                        <input
                            type="text"
                            className="w-full border rounded-lg p-4"
                            placeholder="Price"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">
                            Max Per Wallet
                        </label>
                        <input
                            type="number"
                            className="w-full border rounded-lg p-4"
                            placeholder="Max Per Wallet"
                            value={maxPerWallet}
                            onChange={(e) => setMaxPerWallet(Number(e.target.value))}
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">
                            Start Date
                        </label>
                        <input
                            type="datetime-local"
                            className="w-full border rounded-lg p-4"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">
                            End Date
                        </label>
                        {!unlimitedTime ? (
                            <input
                                type="datetime-local"
                                className="w-full border rounded-lg p-4"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        ) : (
                            <p className="text-gray-500">Unlimited Time</p>
                        )}
                    </div>

                    <div className="mb-6">
                        <label className="inline-flex items-center">
                            <input
                                type="checkbox"
                                className="mr-2"
                                checked={unlimitedTime}
                                onChange={(e) => setUnlimitedTime(e.target.checked)}
                            />
                            Unlimited Time
                        </label>
                    </div>

                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Artwork</label>
                    <div
                        className="border rounded-lg p-8 flex flex-col items-center justify-center text-center min-h-[600px]">
                        {artwork ? (
                            <img
                                src={URL.createObjectURL(artwork)}
                                alt="Artwork"
                                className="max-w-full max-h-[500px]"
                            />
                        ) : (
                            <>
                                <FontAwesomeIcon
                                    icon={faImage}
                                    className="text-4xl text-gray-300 mb-4"
                                />
                                <p className="text-gray-500 mb-2">Add token media</p>
                                <p className="text-sm text-gray-500">
                                    Use a PNG, JPG, WEBP, GIF, WebM, MP4, WAV or MP3. We recommend
                                    a size of at least 2000x2000 pixels for images.
                                </p>
                                <input
                                    type="file"
                                    className="hidden"
                                    id="artwork-upload"
                                    onChange={handleFileUpload}
                                />
                                <label
                                    htmlFor="artwork-upload"
                                    className="mt-4 bg-black text-white py-2 px-4 rounded-md cursor-pointer"
                                >
                                    Upload Artwork
                                </label>
                            </>
                        )}
                    </div>
                </div>
                <div className="space-y-8">
                    <button
                        className="bg-black text-white py-3 px-6 rounded-md flex items-center space-x-2 w-full"
                        onClick={deploy}
                        disabled={isLoading}
                    >
                        <FontAwesomeIcon icon={faRocket}/>
                        <span>{isLoading ? "Deploying..." : "Deploy collection"}</span>
                    </button>
                    <p className="text-center text-black mt-4">
                        Once you initiate the deploy process it can't be paused or undone.
                        Make sure all your collection details are correct before processing.
                    </p>
                </div>
            </div>
        </div>
    );
}
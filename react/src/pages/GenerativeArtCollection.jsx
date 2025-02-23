import React, {useState} from 'react';
import {ethers} from "ethers";
import contractABI from "../contracts/GenerativeArtNFT.json";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faImage, faPlus, faRocket} from "@fortawesome/free-solid-svg-icons";
import {pinata} from "./CreateDropCollection";
import ZipExtractor from "../components/ui/create/ZipExtractor";

const GenerativeArt = () => {
    const [collectionName, setCollectionName] = useState("");
    const [collectionSymbol, setCollectionSymbol] = useState("");
    const [description, setDescription] = useState("");
    const [artwork, setArtwork] = useState(null);
    const [baseURI, setBaseURI] = useState("");
    const [collectionId, setCollectionId] = useState(null);
    const [mintPrice, setMintPrice] = useState("0.01");
    const [folderId, setFolderId] = useState(null);

    const [isLoading, setIsLoading] = useState(false);

    // New state variables for parameters
    const [maxSupply, setMaxSupply] = useState(100);

    // State variables for additional metadata
    const [externalUrl, setExternalUrl] = useState("");

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setArtwork(file);
        }
    };

    const [collectionAddresses, setCollectionAddresses] = useState([""]);

    const addAddressField = () => setCollectionAddresses([...collectionAddresses, ""]);

    const handleAddressChange = (index, value) => {
        const newAddresses = [...collectionAddresses];
        newAddresses[index] = value;
        setCollectionAddresses(newAddresses);
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

    const createCollection = async (contractURI, userAddress) => {
        try {
            const response = await fetch('http://localhost:8080/api/collections/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contractURI, userAddress, effects: collectionAddresses, folderId, mintPrice }),
            });

            if (!response.ok) throw new Error("Failed to create collection");

            const data = await response.json();
            console.log("Collection Created:", data);

            const newBaseURI = data.baseURI; // Lưu biến tạm
            setBaseURI(newBaseURI);
            setCollectionId(data.collectionId);

            return { collectionId: data.collectionId, baseURI: newBaseURI }; // Trả về luôn để deploy dùng ngay
        } catch (error) {
            console.error("Error creating collection:", error);
            return null;
        }
    };

    const deploy = async () => {
        const contractURI = await uploadToIPFS();

        try {
            if (!window.ethereum) {
                alert("MetaMask is not installed!");
                return;
            }

            const accounts = await window.ethereum.request({ method: "eth_accounts" });

            // 🟢 Gọi createCollection và nhận lại collectionId, baseURI luôn
            const collectionData = await createCollection(contractURI, accounts[0]);
            if (!collectionData) {
                alert("Collection creation failed.");
                return;
            }

            const { collectionId, baseURI } = collectionData; // Lấy trực tiếp từ API response

            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contractFactory = new ethers.ContractFactory(
                contractABI.abi,
                contractABI.bytecode,
                signer
            );

            console.log("baseURI", baseURI); // Bây giờ đảm bảo baseURI có giá trị
            console.log(ethers.parseEther(mintPrice));

            const transaction = await contractFactory.deploy(
                // baseURI,
                contractURI,
                collectionName,
                collectionSymbol,
                maxSupply,
                ethers.parseEther(mintPrice)
            );

            const transactionReceipt = await transaction.deploymentTransaction().wait();
            if (transactionReceipt.status === 1) {
                console.log(`Updating collection contract: ${collectionId}`);

                const response = await fetch(`http://localhost:8080/api/collections/${collectionId}/contract`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ contractAddress: transactionReceipt.contractAddress }),
                });

                const data = await response.json();
                console.log("Collection updated:", data);
                alert("Collection created successfully!");
            }
        } catch (error) {
            console.error("Error deploying contract:", error);
            alert("Failed to deploy contract. Check the console for details.");
        }
    };

    return (
        <div className="mx-auto p-8 z-[50]">
            <h1 className="text-4xl font-bold mb-8 ml-5 text-slate-50">Collection Generative Art</h1>
            <ZipExtractor setFolderId={setFolderId} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className={`text-slate-50`}>
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">
                            Collection name
                        </label>
                        <input
                            type="text"
                            className="w-full border rounded-lg p-4 text-black"
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
                            className="w-full border rounded-lg p-4 text-black"
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
                            className="w-full border rounded-lg p-4 text-black"
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
                            className="w-full border rounded-lg p-4 text-black"
                            placeholder="https://example.com"
                            value={externalUrl}
                            onChange={(e) => setExternalUrl(e.target.value)}
                        />
                    </div>

                    {/* New input fields for parameters */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">
                            Total Supply
                        </label>
                        <input
                            type="number"
                            className="w-full border rounded-lg p-4 text-black"
                            placeholder="Max Supply"
                            value={maxSupply}
                            onChange={(e) => setMaxSupply(Number(e.target.value))}
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">
                            Mint Price
                        </label>
                        <input
                            type="number"
                            className="w-full border rounded-lg p-4 text-black"
                            placeholder="Max Supply"
                            value={mintPrice}
                            onChange={(e) => setMintPrice(Number(e.target.value))}
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">Linked Collection Addresses</label>
                        {collectionAddresses.map((address, index) => (
                            <input
                                key={index}
                                type="text"
                                className="w-full border rounded-lg p-4 mb-2 text-black"
                                placeholder="0x..."
                                value={address}
                                onChange={(e) => handleAddressChange(index, e.target.value)}
                            />
                        ))}
                        <button
                            className="mt-2 bg-gray-200 text-black py-2 px-4 rounded-md flex items-center"
                            onClick={addAddressField}
                        >
                            <FontAwesomeIcon icon={faPlus} className="mr-2" /> Add Address
                        </button>
                    </div>
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

                <div>
                    <label className="block text-sm font-medium mb-2">Thumbnail</label>
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
                                <p className="text-gray-500 mb-2">Add thumbnail</p>
                                <p className="text-sm text-gray-500">
                                    Use a PNG, JPG, WEBP, GIF. We recommend
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
                                    Upload Thumbnail
                                </label>
                            </>
                        )}
                    </div>
                </div>
                {/*<div className="space-y-8">*/}
                {/*    <button*/}
                {/*        className="bg-black text-white py-3 px-6 rounded-md flex items-center space-x-2 w-full"*/}
                {/*        onClick={deploy}*/}
                {/*        disabled={isLoading}*/}
                {/*    >*/}
                {/*        <FontAwesomeIcon icon={faRocket}/>*/}
                {/*        <span>{isLoading ? "Deploying..." : "Deploy collection"}</span>*/}
                {/*    </button>*/}
                {/*    <p className="text-center text-black mt-4">*/}
                {/*        Once you initiate the deploy process it can't be paused or undone.*/}
                {/*        Make sure all your collection details are correct before processing.*/}
                {/*    </p>*/}
                {/*</div>*/}
            </div>
        </div>
    );
};

export default GenerativeArt;

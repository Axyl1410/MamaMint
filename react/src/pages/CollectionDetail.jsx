import React, {useEffect, useRef, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {ethers} from "ethers";
import GenerateArtContract from "../contracts/GenerativeArtNFT.json";
import axios from "axios";

const CollectionDetail = () => {
    const {collectionId} = useParams();
    const [collection, setCollection] = useState(null);
    const [nfts, setNfts] = useState([]);
    const [htmlContent, setHtmlContent] = useState('');
    const [contractAddress, setContractAddress] = useState("");
    const [effectedCollection, setEffectedCollection] = useState(null);
    const [iframeKey, setIframeKey] = useState(Date.now());
    const iframeRef = useRef(null);
    const [folderId, setFolderId] = useState(null);
    const [mintPrice, setMintPrice] = useState(0);
    const reloadIframe = () => {
        console.log("Reload iframe");
        setIframeKey(Date.now()); // Cập nhật key để re-render iframe
    };

    const [sessionId, setSessionId] = useState(null);
    const [metadata, setMetadata] = useState(null);
    const [params, setParams] = useState(null);
    const [paramInput, setParamInput] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [nftsRes, collectionRes] = await Promise.all([
                    fetch(`http://localhost:8080/api/collections/nfts/${collectionId}`).then(res => res.json()),
                    fetch(`http://localhost:8080/api/collections/${collectionId}`).then(res => res.json())
                ]);
                console.log(nftsRes)
                // Fetch metadata từ tokenURI
                const nftsWithMetadata = await Promise.all(
                    nftsRes.map(async (nft, index) => {
                        try {
                            const metadataRes = await fetch(nft.tokenURI);
                            const metadata = await metadataRes.json();
                            metadata.id = index;
                            console.log(metadata)
                            // Kiểm tra nếu đường dẫn hình ảnh là IPFS, thay đổi sang HTTP gateway
                            if (metadata.image.startsWith("ipfs://")) {
                                metadata.image = metadata.image.replace("ipfs://", "https://ipfs.io/ipfs/");
                            }

                            return {...nft, ...metadata}; // Gộp metadata vào object NFT
                        } catch (error) {
                            console.error(`Error fetching metadata for token ${nft.tokenId}:`, error);
                            return {...nft, name: "Unknown", image: "", description: "Metadata fetch failed"};
                        }
                    })
                );
                console.log(collectionRes)
                setEffectedCollection(collectionRes.effects);
                setMintPrice(collectionRes.mintPrice);
                fetch(collectionRes.contractURI)
                    .then(res => res.json()) // ✅ Return res.json()
                    .then(data => {
                        console.log(data);
                        setCollection(data); // ✅ Set state inside .then()
                    })
                    .catch(error => console.error("Error fetching collection:", error));

                setNfts(nftsWithMetadata);
                setContractAddress(collectionRes.contractAddress);
                setFolderId(collectionRes.folderId);
                setHtmlContent(`http://localhost:8080/generate/view/${collectionRes.folderId}/?h=0`);
                if (collectionRes.contractURI) {
                    const metadata = await fetch(collectionRes.contractURI).then(res => res.json());
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();

    }, [collectionId]);

    useEffect(() => {
        const receiveMessage = (event) => {
            if (event.data && event.data.params) {
                setParams(event.data.params);
            }
        };

        window.addEventListener("message", receiveMessage);
        return () => {
            window.removeEventListener("message", receiveMessage);
        };
    }, []);

    // if (!collection) {
    //     const queryString = new URLSearchParams(paramInput).toString();
    //     const url = `http://localhost:8080/generate/screenshot/${collection?.folderId}?${queryString}`;
    //     console.log(url)
    // }

    useEffect(() => {
        const receiveMessage = (event) => {
            if (!event.data || !event.data.sessionId) return;

            setTimeout(() => {
                setSessionId(event.data.sessionId);
                fetch(`http://localhost:8080/generate/get-metadata/${event.data.sessionId}`)
                    .then(response => response.json())
                    .then(data => setMetadata(data.metadata))
                    .catch(error => console.error('Error fetching metadata:', error));
            }, 1000);
        };

        window.addEventListener("message", receiveMessage);
        console.log("get metadata")
        return () => {
            window.removeEventListener("message", receiveMessage);
        };
    }, []);

    // if (!collection) {
    //     return <div className="flex justify-center items-center min-h-screen text-lg font-semibold">Loading...</div>;
    // }

    useEffect(() => {
        if (folderId && paramInput) {
            console.log("folderId và paramInput đã sẵn sàng:", folderId, paramInput);
        }
    }, [folderId, paramInput]);


    const captureAndUpload = async (params) => {
        try {
            // Chuyển object params thành query string
            const queryString = new URLSearchParams(params).toString();
            console.log("collection.folderId ", collectionId);
            const url = `http://localhost:8080/generate/screenshot/${folderId}?${queryString}`;

            console.log("Sending request to:", url);

            // 🟢 Gọi API chụp ảnh với params
            const response = await fetch(url);
            if (!response.ok) throw new Error("Failed to capture screenshot");

            const blob = await response.blob(); // Lấy ảnh dưới dạng Blob

            // 🟢 Tạo FormData để upload lên Pinata
            const formData = new FormData();
            formData.append("file", blob, "nft_image.png");

            const metadata = JSON.stringify({
                name: "NFT Image",
                keyvalues: {
                    collectionId: collectionId,
                    user: "Generated NFT",
                },
            });

            formData.append("pinataMetadata", metadata);
            formData.append("pinataOptions", JSON.stringify({cidVersion: 0}));

            // 🟢 Gửi yêu cầu upload lên Pinata
            const pinataRes = await axios.post(
                "https://api.pinata.cloud/pinning/pinFileToIPFS",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        "Authorization": `Bearer ${process.env.REACT_APP_PINATA_JWT}`,
                    },
                }
            );

            if (pinataRes.data.IpfsHash) {
                console.log("IPFS Hash:", pinataRes.data.IpfsHash);
                return pinataRes.data.IpfsHash;
            } else {
                alert("Upload thất bại.");
                return null;
            }
        } catch (error) {
            console.error("Lỗi khi chụp và upload ảnh:", error);
            alert("Có lỗi xảy ra, vui lòng thử lại.");
            return null;
        }
    };

    const mint = async () => {
        if (!window.ethereum) {
            alert("Please install MetaMask!");
            return;
        }

        try {
            await window.ethereum.request({ method: "eth_requestAccounts" });

            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(contractAddress, GenerateArtContract.abi, signer);

            const tx = await contract.mint({
                value: ethers.parseEther(mintPrice.toString()),
            });
            const receipt = await tx.wait();
            console.log("Transaction receipt:", receipt);

            if (!receipt.status) {
                alert("Minting failed!");
                return;
            }

            // 🟢 Lấy tokenId từ sự kiện Transfer
            const transferEvent = receipt.logs
                .map(log => {
                    try {
                        return contract.interface.parseLog(log);
                    } catch {
                        return null;
                    }
                })
                .find(event => event && event.name === "Transfer");

            if (!transferEvent) {
                console.error("Transfer event not found.");
                return;
            }
            const tokenId = transferEvent.args.tokenId.toString();
            console.log("tokenID:", tokenId);

            const txHash = tx.hash;
            const blockNumber = receipt.blockNumber;
            const block = await provider.getBlock(blockNumber);
            const walletAddress = await signer.getAddress();
            const gasUsed = receipt.gasUsed.toString();

            let nftsOfWallet = [];

            try {
                const results = await Promise.all(
                    effectedCollection.map(async (address) => {
                        console.log(`http://localhost:8080/api/collections/user-nfts-with-traits?walletAddress=${walletAddress}&contractAddress=${address}`);
                        const response = await fetch(`http://localhost:8080/api/collections/user-nfts-with-traits?walletAddress=${walletAddress}&contractAddress=${address}`);
                        const data = await response.json();
                        console.log(data);
                        return data; // Return data for each fetch
                    })
                );

                // Flatten the nested arrays if needed
                nftsOfWallet = results.flat();
            } catch (error) {
                console.error('Error fetching NFTs:', error);
            }

            console.log("NFTs of Wallet:", nftsOfWallet);
            console.log(nftsOfWallet.length)
            // const nftsOfWalletJson = `${nftsOfWallet}`;
            // console.log("Stringified:", nftsOfWalletJson);
                const nftsOfWalletJson = JSON.stringify(nftsOfWallet);
            if (nftsOfWallet ) {
                console.log("Stringified:", nftsOfWalletJson);

            }

            console.log("Encoded:", encodeURIComponent(nftsOfWalletJson));

            const newParamInput = {
                a: contractAddress || ethers.Wallet.createRandom().address,
                c: 1,
                s: 100,
                ms: 1,
                mi: 1,
                h: txHash,
                bh: block.hash,
                bn: blockNumber,
                tid: tokenId,
                wa: walletAddress,
                t: Math.floor(Date.now() / 1000),
                gp: Math.floor(Math.random() * (100 - 20 + 1) + 20),
                gu: gasUsed,
                ic: "0",
                pr: "0",
                nfts: encodeURIComponent(JSON.stringify(nftsOfWallet))
            };

            console.log(newParamInput);

            const ipfsHash = await captureAndUpload(newParamInput);
            if (!ipfsHash) {
                alert("Failed to upload image to IPFS.");
                return;
            }

            const nft = {
                image: `ipfs://${ipfsHash}`,
                ...metadata,
            };
            await fetch(`http://localhost:8080/api/collections/${collectionId}/metadata`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    tokenId: tokenId,
                    metadata: nft,
                }),
            });

            const traitTypes = Object.keys(metadata.traits);
            const traitValues = Object.values(metadata.traits).map(String);

            const txSent = await contract.setTokenMetadata(
                tokenId, // 🟢 Thêm tokenId vào đây
                metadata.name,
                metadata.description,
                "ipfs://" + ipfsHash,
                traitTypes,
                traitValues
            );

            console.log("Transaction sent:", txSent);
            alert("Mint successful!");
        } catch (error) {
            console.error("Minting error:", error);
            alert("Minting failed! See console for details.");
        }
    };

    return (
        <div className="container mx-auto p-6 max-w-5xl space-y-8 z-[40]">
            {/* Collection Info */}
            <div className="bg-white shadow-xl rounded-xl p-6 text-center space-y-4">
                <img
                    src={collection?.image}
                    alt={collection?.collectionName}
                    className="w-40 h-40 mx-auto rounded-xl shadow-md"
                />
                <h1 className="text-3xl font-bold text-gray-800">{collection?.name}</h1>
                <p className="text-gray-600">{collection?.description}</p>
                {collection?.externalUrl && (
                    <a
                        href={`https://${collection?.externalUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                    >
                        {collection?.externalUrl}
                    </a>
                )}
                <h3>Contract Address: {contractAddress}</h3>
            </div>

            {/* Iframe Section */}
            <div className="flex flex-col items-center space-y-4">
                <iframe
                    key={iframeKey}
                    ref={iframeRef}
                    src={htmlContent}
                    sandbox="allow-same-origin allow-scripts allow-forms"
                    className="w-full max-w-3xl h-96 border rounded-xl shadow-lg"
                />
                <button
                    onClick={reloadIframe}
                    className="bg-gray-700 hover:bg-gray-800 text-white font-semibold py-2 px-5 rounded-lg transition-all duration-300 shadow-md"
                >
                    🔄 Regenerate
                </button>
            </div>

            {/* Mint Button */}
            <button
                onClick={mint}
                className="bg-gradient-to-r justify-center from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-bold py-3 px-6 rounded-lg transition duration-300 shadow-lg transform hover:scale-105"
            >
                MINT {mintPrice} Forma
            </button>

            {/* Token Metadata */}
            {metadata && (
                <div className="bg-gray-100 p-6 rounded-lg shadow-lg space-y-3">
                    <h2 className="text-2xl font-semibold text-gray-800">📜 Token Metadata</h2>
                    <p><strong>ID:</strong> {metadata.id}</p>
                    <p><strong>Name:</strong> {metadata.name}</p>
                    <p><strong>Description:</strong> {metadata.description}</p>
                    <h3 className="text-xl font-semibold">Traits:</h3>
                    <ul className="list-disc pl-5 text-gray-700">
                        {Object.entries(metadata.traits).map(([key, value]) => (
                            <li key={key}><strong>{key}:</strong> {value}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Parameters */}
            {/*{params && (*/}
            {/*    <div className="bg-gray-100 p-6 rounded-lg shadow-md">*/}
            {/*        <h2 className="text-2xl font-semibold text-gray-800">🛠️ Parameters</h2>*/}
            {/*        <pre className="bg-gray-200 p-4 rounded-lg text-sm overflow-auto">{JSON.stringify(params, null, 2)}</pre>*/}
            {/*    </div>*/}
            {/*)}*/}

            {/* NFT Grid */}
            {nfts.length > 0 && (
                <div>
                    <h2 className="text-2xl font-bold mb-4 text-sky-50">NFTs of Collection</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {nfts.map((nft) => (
                            <Link
                                to={`/nft/${contractAddress}/${nft.tokenId}`}
                                key={nft.tokenId}
                                className="bg-white shadow-lg rounded-xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
                            >
                                <img
                                    src={nft.image}
                                    alt={nft.name}
                                    className="w-full h-56 object-cover"
                                />
                                <div className="p-4 space-y-2">
                                    <h3 className="text-lg font-semibold text-gray-800">{nft.name}</h3>
                                    {/*<p className="text-gray-600 text-sm">{nft.description}</p>*/}
                                    {/*<div className="flex justify-between text-sm text-gray-500">*/}
                                    {/*    <span>Owner:</span>*/}
                                    {/*    <span className="truncate max-w-[140px]">{nft.owner}</span>*/}
                                    {/*</div>*/}
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>


    );
};

export default CollectionDetail;

import React, { useEffect, useState } from 'react';
import {Link, useParams} from "react-router-dom";

const Profile = () => {
    const [collections, setCollections] = useState([]);
    const [nfts, setNfts] = useState([]);
    const account = useParams().address;

    useEffect(() => {
        if (!account) return;

        fetch(`http://localhost:8080/api/collections/wallet/${account}`)
            .then(res => res.json())
            .then(data => setCollections(Array.isArray(data) ? data : [data]))
            .catch(() => setCollections([]));

        fetch(`http://localhost:8080/api/nfts/user/${account}`)
            .then(res => res.json())
            .then(data => setNfts(Array.isArray(data) ? data : [data]))
            .catch(() => setNfts([]));
    }, [account]);

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
            <h1 className="text-3xl font-bold mb-6 text-center">Your NFT Collections</h1>

            {collections.length === 0 ? (
                <p className="text-center text-gray-400">No collections found</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {collections.map((collection) => (
                        <Link to={`/collection/${collection._id}`} key={collection._id} className="bg-gray-800 shadow-lg rounded-xl overflow-hidden">
                            {collection.artworkURL && (
                                <img src={collection.artworkURL.replace("ipfs://", "https://ipfs.io/ipfs/")}
                                     alt={collection.name} className="w-full h-48 object-cover" />
                            )}
                            <div className="p-4">
                                <h2 className="text-xl font-semibold">{collection.collectionName} ({collection.collectionSymbol})</h2>
                                <p className="text-gray-400">{collection.description}</p>
                                {collection.externalUrl && (
                                    <a href={collection.externalUrl} target="_blank" rel="noopener noreferrer"
                                       className="text-blue-400 hover:text-blue-300 mt-2 inline-block">
                                        View More
                                    </a>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            <h2 className="text-3xl font-bold mt-6 mb-4 text-center">Your NFTs</h2>

            {nfts.length === 0 ? (
                <p className="text-center text-gray-400">No NFTs found</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {nfts.map((nft) => (
                        <Link to={`/nft/${nft._id}`} key={nft._id} className="bg-gray-800 shadow-lg rounded-xl overflow-hidden">
                            {nft.image && (
                                <img src={nft.image.replace("ipfs://", "https://ipfs.io/ipfs/")}
                                     alt={nft.name} className="w-full h-48 object-cover" />
                            )}
                            <div className="p-4">
                                <h3 className="text-lg font-semibold">{nft.name}</h3>
                                <p className="text-gray-400">{nft.description}</p>
                                <div className="mt-2">
                                    {nft.attributes?.map((attr, index) => (
                                        <span key={index} className="mr-2 px-2 py-1 bg-gray-700 rounded-lg text-sm">
                                            {attr.trait_type}: {attr.value}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Profile;

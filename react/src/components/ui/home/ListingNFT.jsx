import React, { useEffect, useState } from 'react';
import {Link} from "react-router-dom";

const ListingNFT = () => {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchListings = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/marketplace/listings');
                if (!response.ok) throw new Error('Failed to fetch listings');
                const data = await response.json();
                setListings(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchListings();
    }, []);

    if (loading) return <div className="text-center text-lg py-10">Loading listings...</div>;
    if (error) return <div className="text-center text-red-500 text-lg py-10">Error: {error}</div>;

    return (
        <div className="max-w-6xl mx-auto min-h-screen py-12">
            <h1 className="text-4xl font-extrabold mb-10 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                Marketplace
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {listings.map((item) => (
                    <Link
                        to={`/nft/${item._id}`}
                        key={item._id}
                        className="relative overflow-hidden rounded-2xl shadow-2xl transition-transform duration-300 transform hover:scale-105 group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-800 to-gray-700 opacity-70 group-hover:opacity-80 transition-opacity duration-300"></div>
                        <img
                            src={item.tokenMetadata.image.replace('ipfs://', 'https://ipfs.io/ipfs/')}
                            alt={item.tokenMetadata.name}
                            className="w-full h-60 object-cover rounded-t-2xl"
                        />
                        <div className="p-6 relative bg-[#0C0C0C]">
                            <h2 className="text-xl font-semibold mb-2 text-blue-300">{item.tokenMetadata.name}</h2>
                            <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                                {item.tokenMetadata.description}
                            </p>
                            <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-[#F2613F]">
                  {item.price} ETH
                </span>
                                <span className="text-green-300 font-semibold">Buy Now</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default ListingNFT;

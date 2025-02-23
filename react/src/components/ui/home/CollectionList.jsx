import {useEffect, useState} from "react";
import {Link} from "react-router-dom";

export default function CollectionList() {
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("http://localhost:8080/api/collections")
            .then((res) => res.json())
            .then(async (data) => {
                const enrichedCollections = await Promise.all(
                    data.map(async (collection) => {
                        try {
                            const metaRes = await fetch(collection.contractURI);
                            const metadata = await metaRes.json();
                            return {...collection, metadata};
                        } catch (error) {
                            console.error("Error fetching metadata:", error);
                            return {...collection, metadata: null};
                        }
                    })
                );
                console.log(enrichedCollections)
                setCollections(enrichedCollections);
            })
            .catch((error) => console.error("Error fetching collections:", error))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div>Loading collections...</div>;

    return (
        // <div className="p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        //     {collections.map((collection) => (
        //         <Link
        //             to={`/collection/${collection._id}`}
        //             key={collection._id}
        //             className="border border-gray-300 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-300 bg-white"
        //         >
        //             {collection.metadata ? (
        //                 <>
        //                     <img
        //                         src={collection.metadata.image}
        //                         alt={collection.metadata.name}
        //                         className="w-full h-52 object-cover rounded-md"
        //                     />
        //                     <h2 className="text-lg font-semibold mt-3">{collection.metadata.name}</h2>
        //                     <p className="text-gray-600 text-sm">{collection.metadata.description}</p>
        //                     <p className="text-blue-500 font-semibold mt-2">
        //                         Mint Price: {collection.mintPrice || "0"} Forma
        //                     </p>
        //                 </>
        //             ) : (
        //                 <p className="text-red-500">Metadata not available</p>
        //             )}
        //         </Link>
        //     ))}
        // </div>
        <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl font-extrabold mb-10 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                NFT Collection
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {collections.map((collection) => (
                    <Link
                        to={`/collection/${collection._id}`}
                        key={collection._id}
                        className="relative overflow-hidden rounded-2xl shadow-2xl transition-transform duration-300 transform hover:scale-105 group">
                        <div
                            className="absolute inset-0 from-gray-800 to-gray-700 opacity-70 group-hover:opacity-80 transition-opacity duration-300"></div>
                        <img src={collection.metadata.image}
                             alt={collection.metadata.name}
                             className="w-full h-60 object-cover rounded-t-2xl"/>
                        <div className="p-6 relative bg-[#0C0C0C]">
                            <h2 className="text-xl font-semibold mb-2 text-blue-300">{collection.metadata.name}</h2>
                            <p className="text-gray-300 text-sm mb-4">{collection.metadata.description}</p>
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-[#F2613F]">{collection.mintPrice || "0"} Forma</span>
                                <span className="text-green-300 font-semibold">Mint</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
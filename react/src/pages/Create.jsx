import React from 'react';
import {Link} from "react-router-dom";

const Create = () => {

    const openCreateDropModal = () => {
        // Open the create drop modal

    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-purple-500 to-indigo-600 p-8 w-full">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-2xl p-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Create</h2>

                {/* Create a Drop Section */}
                <div className="mb-8">
                    <h3 className="text-2xl font-semibold text-gray-700 mb-4">Create a Drop</h3>
                    <p className="text-gray-600 mb-4">
                        A drop is a collection of NFTs that are released at a specific time. Create a drop to build hype and allow users to mint your NFTs.
                    </p>
                    <Link to={`/create/drop`} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
                        Create Drop
                    </Link>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200 my-8"></div>

                {/* Create a Collection or Item Section */}
                <div>
                    <h3 className="text-2xl font-semibold text-gray-700 mb-4">Create a Collection or Item</h3>
                    <p className="text-gray-600 mb-4">
                        Create a collection to group your NFTs or create a single item. Collections help organize your work and make it easier for users to discover.
                    </p>
                    <div className="flex space-x-4">
                        <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
                            Create Collection
                        </button>
                        <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
                            Create Item
                        </button>
                    </div>
                </div>

                {/* Additional Info Section */}
                <div className="mt-8 bg-gray-50 p-6 rounded-lg">
                    <h4 className="text-xl font-semibold text-gray-700 mb-4">Need Help?</h4>
                    <p className="text-gray-600 mb-4">
                        If you're new to creating NFTs, check out our guide on how to get started. We'll walk you through the process step-by-step.
                    </p>
                    <a href="#" className="text-blue-500 hover:text-blue-600 font-semibold">
                        Learn More →
                    </a>
                </div>
            </div>
            <div
                
            >
                Deploy a Drop smart contract

            </div>
        </div>
    );
};

export default Create;
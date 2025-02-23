import {
  faCircleCheck,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import axios from "axios";
import {Link} from "react-router-dom";

import { PinataSDK } from "pinata-web3"

export const pinata = new PinataSDK({
  pinataJwt: process.env.REACT_APP_PINATA_JWT,
  pinataGateway: process.env.REACT_APP_PINATA_GATEWAY
})

export default function TrendingItem({ dropId, creator, price, maxSupply, totalMinted, baseURI }) {
  const [metadata, setMetadata] = useState(null);

  // Fetch metadata from the baseURI
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const metadataURL = `${baseURI}`; // Construct the metadata URL
        console.log(metadataURL)
        const ipfsHash = metadataURL.split('/ipfs/')[1];
        const { data, contentType } = await pinata.gateways.get(ipfsHash)
        setMetadata(data);
      } catch (error) {
        console.error("Error fetching metadata:", error);
      }
    };

    fetchMetadata();
  }, [baseURI]);

  if (!metadata) {
    return <div>Loading metadata...</div>;
  }

  return (
      <Link to={`/nft/${dropId}`} className="border-b border-gray-200 py-4 flex flex-row items-center max-h-40 max-w-[420px] group">
        <img src={metadata.image} alt={metadata.name} className="mb-2 w-24 h-24 object-cover" />
        <div className="flex flex-col ml-4">
          <h2 className="text-xl font-bold line-clamp-1 max-w-56">
            {metadata.name}
          </h2>
          <p className="flex items-center gap-2">
            <span className="text-sm text-gray-700">{creator}</span>
            <FontAwesomeIcon
                icon={faCircleCheck}
                className="text-yellow-500"
            />
          </p>
          <p>{price} ETH</p>
          <div className="relative h-6 overflow-hidden mt-2">
            <div className="absolute inset-0 flex flex-col animate-slide text-sm">
              <p className="text-gray-500">{totalMinted} minted</p>
              <p className="text-green-500">{totalMinted} minted in last 24 hours</p>
            </div>
          </div>
        </div>
        <FontAwesomeIcon
            icon={faChevronRight}
            className="ml-auto invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-300 ease-in-out"
        />
      </Link>
  );
}
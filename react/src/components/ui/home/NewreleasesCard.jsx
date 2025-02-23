import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquareUpRight } from "@fortawesome/free-solid-svg-icons";
export default function NewreleasesCard() {
  const [showDescriptions, setShowDescriptions] = useState(false);
  const handleToggleDescription = () => {
    setShowDescriptions(!showDescriptions); // Toggle the state
  };

  return (
    <div
      onClick={handleToggleDescription}
      className="flex flex-col gap-2 hover:cursor-pointer"
    >
      <div className="flex  items-center">
        <div className="w-1/6 text-xl font-semibold">Dec 17</div>
        <div className="w-full h-[1px] bg-slate-200"></div>
      </div>
      <div className="flex items-center justify-between ">
        <div className="w-1/6">
          <img
            src="https://placehold.co/100x100"
            alt="Abstract art for MMZ Last Tango"
            className="w-20 h-20 object-cover"
          />
        </div>
        <div className="flex gap-4 w-full justify-between items-center">
          <div className="text-start">
            <div className="text-xl font-semibold">MMZ Last Tango</div>
            <div className="text-gray-500">by qubibi</div>
          </div>
          <div className=" ">
            <div className="text-gray-500 text-xs font-medium">STATUS</div>
            <div className="text-green-500 text-lg">Minting</div>
          </div>
          <div className=" ">
            <div className="text-gray-500 text-xs font-medium">MINT PRICE</div>
            <div className="text-lg font-medium">Ø.5 ETH</div>
          </div>
          <div className=" ">
            <div className="text-gray-500 text-xs font-medium">SUPPLY</div>
            <div className="text-lg ">95</div>
          </div>
          <div className=" ">
            <button className="bg-black text-white w-40 px-4 py-2 rounded">
              Mint
            </button>
          </div>
        </div>
      </div>
      {/* Descriptions */}
      {showDescriptions && ( // Render descriptions only when `showDescriptions` is true
        <div className="ml-40 flex flex-col gap-4  ">
          <p className="text-[16px]  line-clamp-3">
            No matter how art is framed, labeled, or verified, its meaning
            ultimately resides in how it’s perceived.
          </p>
          <p className="text-sm hover:underline hover:underline-offset-2 hover:cursor-pointer">
            Visit project page <FontAwesomeIcon icon={faSquareUpRight} />
          </p>
        </div>
      )}
    </div>
  );
}

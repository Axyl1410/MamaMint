import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
export default function ExploreFillters() {
  const sortsOption = [
    {
      name: "24 hours",
      value: "newest",
    },
    {
      name: "7 days",
      value: "price-low-to-high",
    },
    {
      name: "30 days",
      value: "price-high-to-low",
    },
  ];
  const [sortResult, setSortResult] = useState(sortsOption[0]);
  const [isDropSortResult, setIsDropSortResult] = useState(false);
  return (
    <div className="py-4 mb-4">
      <h1 className="text-4xl font-bold mb-8">Explore</h1>
      <div className="flex flex-wrap gap-4">
        <div className="relative inline-block">
          <button
            onClick={() => {
              setIsDropSortResult(!isDropSortResult);
            }}
            className="bg-black text-white px-5 py-2  rounded-md flex items-center"
          >
            <div className="flex flex-col  items-center justify-center">
              <p className="text-sm font-semibold ">Trending</p>
              <span className=" text-[10px] text-gray-300 font-medium">
                {sortResult.name}
              </span>
            </div>
            <FontAwesomeIcon icon={faChevronDown} className="ml-3   h-2" />
          </button>
          <ul
            className={`${
              isDropSortResult ? "absolute" : "hidden"
            } z-10 text-xs font-medium text-gray-500 -right-2 top-14 w-32 rounded-lg shadow-md bg-white ring-1 ring-black ring-opacity-5 focus:outline-none`}
          >
            {sortsOption.map((item, index) => (
              <li
                key={index}
                className="p-2 hover:cursor-pointer"
                onClick={() => {
                  setSortResult(item);
                  setIsDropSortResult(!isDropSortResult);
                }}
              >
                <div
                  className={`flex justify-between items-center px-4 py-2 hover:bg-gray-100 ${
                    item.name == sortResult.name ? "bg-gray-100 rounded-lg" : ""
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <p>{item.name}</p>
                  </div>
                  <svg
                    className={`w-4 h-4 ${
                      item.name == sortResult.name ? "block" : "hidden"
                    }`}
                    fill="currentColor"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"
                  >
                    <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" />
                  </svg>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <button className="border border-gray-300 px-4 py-2 rounded-md flex items-center text-sm font-medium">
          Curated
          <FontAwesomeIcon icon={faChevronDown} className="ml-3   h-2" />{" "}
        </button>
        <button className="border border-gray-300 px-4 min-w-20  rounded-md font-medium">
          New
        </button>
        <button className="border border-gray-300 px-4 min-w-20  rounded-md font-medium">
          Free
        </button>
        <button className="border border-gray-300 px-4 min-w-20  rounded-md font-medium">
          Ending soon
        </button>
        <button className="border border-gray-300 px-4 min-w-20  rounded-md font-medium">
          Auctions
        </button>
        <button className="border border-gray-300 px-4 py-2 rounded-md flex items-center text-sm font-medium">
          Category
          <FontAwesomeIcon icon={faChevronDown} className="ml-3   h-2" />{" "}
        </button>{" "}
        <button className="border border-gray-300 px-4 py-2 rounded-md flex items-center text-sm font-medium">
          Tag
          <FontAwesomeIcon icon={faChevronDown} className="ml-3   h-2" />{" "}
        </button>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import TrendingItem from "./TrendingItem";

export default function ListItemTrending() {
  const [isDropSort, setIsDropSort] = useState(false);
  const [sort, setSort] = useState({
    name: "Mới nhất",
    value: "lastest",
  });
  const sorts = [
    {
      name: "Mới nhất",
      value: "lastest",
    },
    {
      name: "Xem nhiều",
      value: "most-viewed",
    },
    {
      name: "Tải nhiều",
      value: "most-downloaded",
    },
  ];

  return (
    <div className="container mx-auto ">
      <h1 className="text-4xl font-bold mb-4">Trending collections</h1>
      <div className="flex items-center mb-4">
        <div className="flex border rounded-md px-1 py-1 gap-1 text-sm font-medium">
          <button className="bg-black text-white px-4 py-1 rounded ">
            Top mints
          </button>
          <button className="bg-white text-gray-500 px-4 py-1 rounded ">
            Top free mints
          </button>
          <button className="bg-white text-gray-500 px-4 py-1 rounded">
            Top artists
          </button>
        </div>
        <div className="ml-auto">
          {/* Sort */}
          <div className="relative inline-block z-50 md:w-32 xl:w-40  border rounded-md">
            <button
              onClick={() => {
                setIsDropSort(!isDropSort);
              }}
              className="inline-flex gap-2 justify-between items-center w-full px-4 py-2 xl:text-sm md:text-sm text-xs font-medium text-gray-700 focus:outline-none focus:ring-0"
            >
              {sort.name}
              <svg
                className={` h-5 w-5 transition-transform duration-200 ease-in-out ${
                  isDropSort ? "rotate-180" : ""
                } `}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06-.02L10 10.659l3.71-3.45a.75.75 0 111.02 1.1l-4 3.75a.75.75 0 01-1.02 0l-4-3.75a.75.75 0 01-.02-1.06z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>

            <ul
              className={`${
                isDropSort ? "absolute" : "hidden"
              } z-10 text-xs font-medium text-gray-500 right-0 top-11 w-40 rounded-lg shadow-md bg-white ring-1 ring-black ring-opacity-5 focus:outline-none`}
            >
              {sorts.map((item, index) => (
                <li
                  key={index}
                  className="px-2 py-1 hover:cursor-pointer"
                  onClick={() => {
                    setSort(item);
                    setIsDropSort(!isDropSort);
                  }}
                >
                  <div
                    className={`flex  justify-between px-4 py-2  hover:bg-gray-100 ${
                      item.name == sort.name ? "bg-gray-100 rounded-lg " : ""
                    }`}
                  >
                    <p className="text-black">{item.name}</p>
                    <svg
                      className={`w-4 h-4 ${
                        item.name == sort.name ? "block " : "hidden"
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
        </div>
      </div>
      {/* List Item */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <TrendingItem />
        <TrendingItem />
        <TrendingItem />
        <TrendingItem />
        <TrendingItem />
        <TrendingItem />
        <TrendingItem />
        <TrendingItem />
      </div>
    </div>
  );
}

import {
  faList,
  faSearch,
  faThLarge,
  faWallet,
} from "@fortawesome/free-solid-svg-icons";
import {
  faPen,
  faArrowDownShortWide,
  faArrowUpWideShort,
  faHourglassEnd,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import { faEthereum } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import Web3 from "web3";

import ListCollectedRows from "../components/ui/profile/ListCollectedRows";
import ListCollectedCols from "../components/ui/profile/ListCollectedCols";
export default function Profile() {
  const fakeData = [
    {
      id: 1,
      imageSrc: "https://placehold.co/50x50",
      title: "Token #1877448",
      name: "Uniswap V3 Positions NFT",
      price: "0.008",
    },
    {
      id: 2,
      imageSrc: "https://placehold.co/50x50",
      title: "Token #1234567",
      name: "OpenSea Collection",
      price: "0.015",
    },
    {
      id: 3,
      imageSrc: "https://placehold.co/50x50",
      title: "Token #6543210",
      name: "Rarible Marketplace",
      price: "0.012",
    },
    {
      id: 3,
      imageSrc: "https://placehold.co/50x50",
      title: "Token #6543210",
      name: "Rarible Marketplace",
      price: "0.012",
    },
    {
      id: 3,
      imageSrc: "https://placehold.co/50x50",
      title: "Token #6543210",
      name: "Rarible Marketplace",
      price: "0.012",
    },
    {
      id: 3,
      imageSrc: "https://placehold.co/50x50",
      title: "Token #6543210",
      name: "Rarible Marketplace",
      price: "0.012",
    },
    {
      id: 3,
      imageSrc: "https://placehold.co/50x50",
      title: "Token #6543210",
      name: "Rarible Marketplace",
      price: "0.012",
    },
    {
      id: 3,
      imageSrc: "https://placehold.co/50x50",
      title: "Token #6543210",
      name: "Rarible Marketplace",
      price: "0.012",
    },
  ];

  const tabs = [
    { name: "Collected" },
    { name: "Listings" },
    { name: "Sent offers" },
    { name: "Received offers" },
    { name: "Rewards" },
  ];

  const sortsOption = [
    {
      name: "Newest first",
      value: "newest",
      icon: <FontAwesomeIcon icon={faEthereum} />,
    },
    {
      name: "Price low to high",
      value: "price-low-to-high",
      icon: <FontAwesomeIcon icon={faArrowUpWideShort} />,
    },
    {
      name: "Price high to low",
      value: "price-high-to-low",
      icon: <FontAwesomeIcon icon={faArrowDownShortWide} />,
    },
    {
      name: "Oldest first",
      value: "oldest",
      icon: <FontAwesomeIcon icon={faHourglassEnd} />,
    },
    {
      name: "Recently sold",
      value: "recently-sold",
      icon: <FontAwesomeIcon icon={faClock} />,
    },
  ];
  const [sortResult, setSortResult] = useState(sortsOption[0]);
  const [isDropSortResult, setIsDropSortResult] = useState(false);
  const [activeTab, setActiveTab] = useState("Collected");
  const [viewType, setViewType] = useState("rows");
  const [isCopied, setIsCopied] = useState(false);
  const [walletAddress, setWalletAddress] = useState(null);
  const [error, setError] = useState(null);
  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  const copyAddress = () => {
    // Địa chỉ ví của bạn
    navigator.clipboard
      .writeText(walletAddress)
      .then(() => {
        setIsCopied(true); // Hiển thị thông báo "Copied!"
        setTimeout(() => setIsCopied(false), 2000); // Ẩn thông báo sau 2 giây
      })
      .catch((err) => {
        console.error("Failed to copy address: ", err);
      });
  };

  useEffect(() => {
    const fetchWalletAddress = async () => {
      if (window.ethereum) {
        try {
          // Request account access
          await window.ethereum.request({ method: "eth_requestAccounts" });

          // Create a Web3 instance
          const web3 = new Web3(window.ethereum);

          // Get the user's wallet address
          const accounts = await web3.eth.getAccounts();
          setWalletAddress(accounts[0]);
        } catch (err) {
          setError("Error connecting to wallet");
          alert(error);
        }
      } else {
        setError("No Web3 provider found. Please install MetaMask.");
      }
    };

    // Fetch wallet address as the component mounts
    fetchWalletAddress();
  }, []);

  const shortenAddress = (address) =>
    address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "";
  return (
    <>
      {walletAddress ? (
        <div className="p-6 w-full">
          {/* information */}
          <div className="text-center">
            <img
              src="https://placehold.co/200x200"
              alt="Profile icon with colorful segments"
              className="mx-auto mb-4 rounded-full"
            />
            <h1 className="text-6xl font-bold mb-4">
              {shortenAddress(walletAddress)}
            </h1>
            <div className="flex items-center justify-center mb-4 relative group">
              <FontAwesomeIcon icon={faWallet} className="mr-2 text-gray-500" />
              <span
                onClick={copyAddress}
                className=" tẽttext-gray-600 cursor-pointer"
              >
                {shortenAddress(walletAddress)}
              </span>

              {/* Hover Image */}
              <div className="absolute hidden group-hover:block bottom-full left-1/2 transform -translate-x-1/2 cursor-pointer">
                <svg
                  width="100"
                  height="100"
                  viewBox="0 0 100 100"
                  className="w-40 h-12 rounded-full"
                >
                  {/* Hình đa giác với các góc bo tròn */}
                  <polygon
                    points="50,0 100,0 100,35 100,70 61,71 50,100 36,71 0,70 0,0 21,0"
                    fill="black"
                    stroke="black"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                  {/* Chữ "copy" */}
                  <text
                    x="50%"
                    y="40%"
                    dominantBaseline="middle"
                    textAnchor="middle"
                    fill="white"
                    className="text-2xl font-medium"
                  >
                    {isCopied ? "Copied!" : "Copy"}
                  </text>
                </svg>
              </div>
            </div>
            <p className="text-gray-500 mb-6">
              You haven’t added a bio yet. Edit your profile to add one.
            </p>
            <div className="flex justify-center space-x-4 text-sm">
              <button className="px-4 py-2 border border-gray-300 rounded-md flex items-center">
                <FontAwesomeIcon icon={faPen} className="mr-2 " />
                Set up your profile
              </button>
            </div>
          </div>
          {/* Collection */}
          <div className="px-4">
            <div className="flex justify-between items-start mb-4 border-b ">
              <div className="flex space-x-4 font-medium text-sm">
                {tabs.map((tab) => (
                  <button
                    key={tab.name}
                    className={`${
                      activeTab === tab.name
                        ? "border-b-2 border-black "
                        : "text-gray-500"
                    } pb-5`}
                    onClick={() => handleTabClick(tab.name)}
                  >
                    {tab.name}
                  </button>
                ))}
              </div>
              <button className="bg-black text-white px-4 py-2  rounded text-sm font-medium">
                Create collection
              </button>
            </div>
            {/* Search and Sort */}
            <div className="flex items-center space-x-4 mb-4 justify-between">
              <div className="flex items-center border rounded p-2 flex-grow max-w-96">
                <FontAwesomeIcon
                  icon={faSearch}
                  className="text-gray-500 mr-2"
                />
                <input
                  type="text"
                  placeholder="Filter tokens by name or ID"
                  className="flex-grow outline-none"
                />
              </div>
              <div className="flex space-x-4">
                <div className="flex space-x-2 items-center border px-2 rounded">
                  <button
                    onClick={() => setViewType("rows")}
                    className={`rounded py-1 px-2 ${
                      viewType === "rows" ? "bg-gray-200" : "bg-transparent"
                    }`}
                  >
                    <FontAwesomeIcon icon={faThLarge} />
                  </button>
                  <button
                    onClick={() => setViewType("cols")}
                    className={`rounded py-1 px-2 ${
                      viewType === "cols" ? "bg-gray-200" : "bg-transparent"
                    }`}
                  >
                    <FontAwesomeIcon icon={faList} />
                  </button>
                </div>
                <div className="xl:max-w-1/4 xl:min-w-1/4 bg-white">
                  <div className="relative inline-block  w-fit min-w-56 ">
                    <button
                      onClick={() => {
                        setIsDropSortResult(!isDropSortResult);
                      }}
                      className="inline-flex gap-2 border shadow-md rounded-lg border-gray-300 justify-between items-center w-full  px-4 py-2  text-sm font-medium text-gray-700 focus:outline-none focus:ring-0"
                    >
                      <p className="flex items-center gap-2">
                        {sortResult.icon} {/* Render the icon */}
                        {sortResult.name}
                      </p>
                      <svg
                        className={` h-5 w-5 transition-transform duration-200 ease-in-out ${
                          isDropSortResult ? "rotate-180" : ""
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
                        isDropSortResult ? "absolute" : "hidden"
                      } z-10 text-xs font-medium text-gray-500 -right-0 top-12 w-56 rounded-lg shadow-md bg-white ring-1 ring-black ring-opacity-5 focus:outline-none`}
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
                              item.name == sortResult.name
                                ? "bg-gray-100 rounded-lg"
                                : ""
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              {item.icon} {/* Render the icon */}
                              <p>{item.name}</p>
                            </div>
                            <svg
                              className={`w-4 h-4 ${
                                item.name == sortResult.name
                                  ? "block"
                                  : "hidden"
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
            </div>
            {/* List Item */}
            <div className="border p-8 text-center min-h-40  ">
              {fakeData.length > 0 ? (
                viewType === "rows" ? (
                  <ListCollectedRows collections={fakeData} />
                ) : (
                  <ListCollectedCols collections={fakeData} />
                )
              ) : (
                <div>
                  <p className="text-xl font-semibold">
                    You haven't minted any tokens on Highlight
                  </p>
                  <p className="text-gray-500">
                    Once you do, they'll appear here.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <p>Loading wallet address...</p>
      )}
    </>
  );
}

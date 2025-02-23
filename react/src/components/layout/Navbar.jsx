import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCirclePlus,
  faArrowRightToBracket,
  faSearch,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [account, setAccount] = useState(null);
  const [ethBalance, setETHBalance] = useState(null);
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  // Connect MetaMask Wallet
  const connectMetaMask = async () => {
    try {
      if (!window.ethereum) {
        alert("MetaMask is not installed. Please install MetaMask and try again.");
        return;
      }
      const web3 = new Web3(window.ethereum);
      const chainId = "0x539";

      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId }],
      });

      const accounts = await web3.eth.requestAccounts();

      const userAccount = accounts[0];
      setAccount(userAccount);

      const userBalance = await web3.eth.getBalance(userAccount);
      const formattedBalance = web3.utils.fromWei(userBalance, 'ether');
      setETHBalance(parseFloat(formattedBalance).toFixed(2));

      alert(`Connected successfully. Wallet: ${userAccount}`);
    } catch (error) {
      console.error("Error connecting to MetaMask:", error);
      alert("Failed to connect to MetaMask. Please try again.");
    }
  };

  // Connect Leap Wallet (Cosmos-based)
  const connectLeap = async () => {
    try {
      if (!window.leap) {
        alert("Leap Wallet is not installed. Please install Leap Wallet and try again.");
        return;
      }

      const chainId = "984123"; // Replace with your Forma Chain ID
      await window.leap.enable(chainId);

      const accounts = await window.leap.getKey(chainId);
      const userAccount = accounts.bech32Address;
      setAccount(userAccount);

      alert(`Connected successfully. Wallet: ${userAccount}`);
    } catch (error) {
      console.error("Error connecting to Leap Wallet:", error);
      alert("Failed to connect to Leap Wallet. Please try again.");
    }
  };

  // Connect Keplr Wallet (Cosmos-based)
  const connectKeplr = async () => {
    try {
      if (!window.keplr) {
        alert("Keplr Wallet is not installed. Please install Keplr Wallet and try again.");
        return;
      }

      const chainId = "0xf043b"; // Replace with your Forma Chain ID
      await window.keplr.enable(chainId);

      const offlineSigner = window.keplr.getOfflineSigner(chainId);
      const accounts = await offlineSigner.getAccounts();
      const userAccount = accounts[0].address;
      setAccount(userAccount);

      alert(`Connected successfully. Wallet: ${userAccount}`);
    } catch (error) {
      console.error("Error connecting to Keplr Wallet:", error);
      alert("Failed to connect to Keplr Wallet. Please try again.");
    }
  };

  // Disconnect Wallet
  const disconnectWallet = () => {
    setAccount(null);
    setETHBalance(null);
    alert("Wallet disconnected.");
  };

  // Shorten Wallet Address
  const shortenAddress = (address) =>
      address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "";

  return (
      <div className="flex items-center justify-between p-4 bg-[#0C0C0C] sticky top-0 z-[50] ">
        {/* Logo and Title */}
        <Link to="/" className="flex items-center space-x-4">
          <span className="text-2xl font-bold text-sky-50">MamaMint</span>
        </Link>

        {/* Search and Buttons */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
                type="text"
                placeholder="Search for artists or collections"
                className="pl-10 pr-4 py-2 border rounded-3xl w-[480px] text-sm bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-gray-600"
            />
            <FontAwesomeIcon
                icon={faSearch}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4 relative">
          {account ? (
              <div className="flex items-center border rounded-lg px-4 py-2">
                <img
                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFwAAABcCAMAAADUMSJqAAAAe1BMVEUDBQT///8AAAD/a2s/QD/m5ub/bmymT1MeFhXybWr5bm4yGx3/am0QEBD/aG3+bW729/ccHBzLzMw3ODdnZ2fg4OClpqYVFxYKAQBfQDugUE84HyKmU1RVKy5EJCbOZGq9XGQpGBobERQvMC+JREbob3ImEhLqb206Hx1jBkhcAAAA+klEQVRoge3XyQ6CMBSF4WvBIgjWAZwVceT9n9CqEUU0qfWSSHL+FasvZ8FUIoQQQgihpieMs7Aj17Doe124LcNc4MBN8f6gRnxo8xCZ4qMa8djCLuPtDyXjiY1dwtusb60KPuWkK8tnS6/S3FtY6i/4Ur5rxYN70qnUayweyjUnrqS6w2HoqNT2dnmHBzJ4yt8Q0614W+4vsm5RpnczLlf+luEJ+ri884MIHDhw4HXjuxpxEkkZV1ecxyYRP+N7pb9sim05ifEDJzro35SQbflle9K/4+KY+kFw4sP1IXp3O8cK0j+L3TzP+WwqzujFNSuOEEIIIfQ3nQHaoBK3kb2v9gAAAABJRU5ErkJggg=="
                    alt="Ethereum logo"
                    className="w-5 h-5 mr-2 bg-black"
                />
                <span className="text-red-700">{ethBalance} Forma</span>
              </div>
          ) : (
              ""
          )}
          <Link to="/generate" className="bg-black text-white px-4 py-2 rounded-md font-semibold text-sm flex items-center space-x-2">
            <FontAwesomeIcon icon={faCirclePlus} /> <span>Create</span>
          </Link>

          {account ? (
              <div className="relative">
                {/* Wallet Button */}
                <button
                    className="bg-black text-white px-4 py-2 rounded-md font-semibold text-sm flex items-center space-x-2"
                    onClick={() => setDropdownOpen(!isDropdownOpen)}
                >
                  {shortenAddress(account)}
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-lg rounded-md z-10">
                      <ul className="divide-y divide-gray-200">
                        <Link to={`/profile/${account}`} className="p-4 text-sm cursor-pointer flex items-center space-x-2 hover:bg-gray-100">Profile</Link>
                        <li
                            className="p-4 text-sm text-red-500 cursor-pointer flex items-center space-x-2 hover:bg-gray-100"
                            onClick={disconnectWallet}
                        >
                          <FontAwesomeIcon icon={faSignOutAlt} />
                          <span>Sign Out</span>
                        </li>
                      </ul>
                    </div>
                )}
              </div>
          ) : (
              <div className="flex space-x-2">
                <button
                    className="bg-black text-white px-4 py-2 rounded-md font-semibold text-sm flex items-center space-x-2"
                    onClick={connectMetaMask}
                >
                  <FontAwesomeIcon icon={faArrowRightToBracket} />{" "}
                  <span>Connect</span>
                </button>
                {/*<button*/}
                {/*    className="bg-black text-white px-4 py-2 rounded-md font-semibold text-sm flex items-center space-x-2"*/}
                {/*    onClick={connectLeap}*/}
                {/*>*/}
                {/*  <FontAwesomeIcon icon={faArrowRightToBracket} />{" "}*/}
                {/*  <span>Leap</span>*/}
                {/*</button>*/}
                {/*<button*/}
                {/*    className="bg-black text-white px-4 py-2 rounded-md font-semibold text-sm flex items-center space-x-2"*/}
                {/*    onClick={connectKeplr}*/}
                {/*>*/}
                {/*  <FontAwesomeIcon icon={faArrowRightToBracket} />{" "}*/}
                {/*  <span>Keplr</span>*/}
                {/*</button>*/}
              </div>
          )}
        </div>
      </div>
  );
}
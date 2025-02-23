require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    forma: {
      url: "https://rpc.sketchpad-1.forma.art", // Arabica Testnet RPC URL
      accounts: ["72a6e3c857fc4ea05fd2cf526d8601d907a8371835594007615ee43d35fdf3cc"], // Replace with your private key
    },
    localhost: {
      url: "http://127.0.0.1:7545",
      accounts: ["0xa5e9f70071c53e0a06d593990d92f047447f7ed8ee285370ce10c7d3ba6361a9"]
    },
  }
};

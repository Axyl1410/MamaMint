// "use client";
// import { createContext, useContext, useEffect, useState } from "react";
// import { ethers } from "ethers";
// import NFTDropPlatform from "../contracts/NFTDropPlatform.json";
//
// const EthereumContext = createContext();
//
// export const EthereumProvider = ({ children }) => {
//     const [provider, setProvider] = useState(null);
//     const [signer, setSigner] = useState(null);
//     const [contract, setContract] = useState(null);
//     const [account, setAccount] = useState(null);
//
//     // Replace with your private key and provider URL
//     const privateKey = "0xae7fd7e27dc02aeababd5d144dd683f38934bcf71794aa8c92b4ea1df4f608cd"; // Your private key
//     const providerUrl = "http://localhost:7545"; // Hardhat local node or any testnet/mainnet provider
//     const contractAddress = "0x46a03Eecd32d3CF950b69aC305db4ABdCdEe13CA"; // Your contract address
//
//     // Initialize provider, signer, and contract
//     const initializeEthereum = async () => {
//         try {
//             // Create a provider (e.g., local Hardhat node or testnet)
//             const provider = new ethers.JsonRpcProvider(providerUrl);
//
//             // Create a wallet from the private key
//             const wallet = new ethers.Wallet(privateKey, provider);
//
//             // Create a contract instance
//             const contract = new ethers.Contract(contractAddress, NFTDropPlatform.abi, wallet);
//
//             // Set state
//             setProvider(provider);
//             setSigner(wallet);
//             setContract(contract);
//             setAccount(wallet.address); // Set the account to the wallet's address
//
//             console.log("Wallet connected:", wallet.address);
//         } catch (error) {
//             console.error("Error initializing Ethereum:", error);
//         }
//     };
//
//     useEffect(() => {
//         initializeEthereum();
//     }, []);
//
//     return (
//         <EthereumContext.Provider value={{ provider, signer, contract, account }}>
//             {children}
//         </EthereumContext.Provider>
//     );
// };
//
// export const useEthereum = () => useContext(EthereumContext);
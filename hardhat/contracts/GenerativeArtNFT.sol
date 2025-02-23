// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

contract GenerativeArtNFT is ERC721Enumerable, Ownable {
    using Strings for uint256;

    uint256 public immutable maxSupply;
    uint256 public totalMinted;
    uint256 public mintPrice;
    string private collectionURI;

    struct Metadata {
        string name;
        string description;
        string image;
        string[] traitTypes;
        string[] traitValues;
    }

    mapping(uint256 => Metadata) private _tokenMetadata;

    constructor(
        string memory initialCollectionURI,
        string memory _name,
        string memory _symbol,
        uint256 _totalSupply,
        uint256 _mintPrice
    ) ERC721(_name, _symbol) Ownable(msg.sender) {
        require(_totalSupply > 0, "Total supply must be greater than 0");
        require(_mintPrice > 0, "Mint price must be greater than 0");
        maxSupply = _totalSupply;
        collectionURI = initialCollectionURI;
        mintPrice = _mintPrice;
    }

    /// @notice Mint NFT with detailed attributes
    function mint(
        string memory name,
        string memory description,
        string memory image,
        string[] memory traitTypes,
        string[] memory traitValues
    ) external payable {
        require(totalMinted < maxSupply, "Max supply reached");
        require(msg.value >= mintPrice, "Insufficient ETH sent");
        require(traitTypes.length == traitValues.length, "Trait length mismatch");

        uint256 tokenId = totalMinted + 1;
        totalMinted++;
        _safeMint(msg.sender, tokenId);

        _tokenMetadata[tokenId] = Metadata(
            name,
            description,
            image,
            traitTypes,
            traitValues
        );
    }

    /// @notice Generate JSON metadata and encode to Base64
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "Token does not exist");
        Metadata memory meta = _tokenMetadata[tokenId];

        string memory attributes = "[";
        for (uint256 i = 0; i < meta.traitTypes.length; i++) {
            attributes = string(
                abi.encodePacked(
                    attributes,
                    '{"trait_type":"',
                    meta.traitTypes[i],
                    '","value":"',
                    meta.traitValues[i],
                    '"}',
                    i == meta.traitTypes.length - 1 ? "" : ","
                )
            );
        }
        attributes = string(abi.encodePacked(attributes, "]"));

        bytes memory data = abi.encodePacked(
            '{"name":"', meta.name,
            '","description":"', meta.description,
            '","image":"', meta.image,
            ',"attributes":', attributes, "}"
        );

        return string(abi.encodePacked("data:application/json;base64,", Base64.encode(data)));
    }

    function _exists(uint256 tokenId) internal view returns (bool) {
        return tokenId > 0 && tokenId <= totalMinted;
    }

    function contractURI() public view returns (string memory) {
        return collectionURI;
    }

    function withdraw() external onlyOwner {
        (bool success, ) = payable(owner()).call{value: address(this).balance}("");
        require(success, "Withdraw failed");
    }
}

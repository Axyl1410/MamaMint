// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract NFTMarketplace is ReentrancyGuard, Ownable {
    struct FixedPriceListing {
        uint256 price;
        address seller;
    }

    struct AuctionListing {
        uint256 startPrice;
        uint256 highestBid;
        address highestBidder;
        uint256 endTime;
        address seller;
    }

    // Mapping từ NFT contract address và tokenId đến thông tin niêm yết
    mapping(address => mapping(uint256 => FixedPriceListing)) public fixedPriceListings;
    mapping(address => mapping(uint256 => AuctionListing)) public auctionListings;

    // Phí marketplace (ví dụ: 2.5%)
    uint256 public marketplaceFee = 25; // 2.5% (được biểu diễn dưới dạng basis points, 1% = 100 basis points)
    address public feeRecipient; // Địa chỉ nhận phí marketplace

    // Sự kiện
    event NFTListedFixedPrice(
        address indexed nftContract,
        uint256 indexed tokenId,
        address indexed seller,
        uint256 price
    );

    event NFTSoldFixedPrice(
        address indexed nftContract,
        uint256 indexed tokenId,
        address indexed seller,
        address buyer,
        uint256 price
    );

    event AuctionCreated(
        address indexed nftContract,
        uint256 indexed tokenId,
        address indexed seller,
        uint256 startPrice,
        uint256 endTime
    );

    event BidPlaced(
        address indexed nftContract,
        uint256 indexed tokenId,
        address indexed bidder,
        uint256 bidAmount
    );

    event AuctionEnded(
        address indexed nftContract,
        uint256 indexed tokenId,
        address indexed seller,
        address winner,
        uint256 winningBid
    );

    constructor(address _feeRecipient, address initialOwner) Ownable(initialOwner) {
        feeRecipient = _feeRecipient;
    }

    // Hàm để niêm yết NFT với giá cố định
    function listNFTFixedPrice(
        address nftContract,
        uint256 tokenId,
        uint256 price
    ) external {
        require(price > 0, "Price must be greater than 0");
        require(
            IERC721(nftContract).ownerOf(tokenId) == msg.sender,
            "You are not the owner of this NFT"
        );
        require(
            IERC721(nftContract).getApproved(tokenId) == address(this) ||
            IERC721(nftContract).isApprovedForAll(msg.sender, address(this)),
            "Marketplace is not approved to transfer this NFT"
        );

        fixedPriceListings[nftContract][tokenId] = FixedPriceListing(price, msg.sender);
        emit NFTListedFixedPrice(nftContract, tokenId, msg.sender, price);
    }

    // Hàm để mua NFT với giá cố định
    function buyNFTFixedPrice(address nftContract, uint256 tokenId) external payable nonReentrant {
        FixedPriceListing memory listing = fixedPriceListings[nftContract][tokenId];
        require(listing.seller != address(0), "NFT is not for sale");
        require(msg.value >= listing.price, "Insufficient payment");

        // Tính toán phí marketplace và số tiền người bán nhận được
        uint256 feeAmount = (msg.value * marketplaceFee) / 1000;
        uint256 sellerAmount = msg.value - feeAmount;

        // Chuyển tiền cho người bán và phí cho marketplace
        payable(listing.seller).transfer(sellerAmount);
        payable(feeRecipient).transfer(feeAmount);

        // Chuyển NFT từ người bán sang người mua
        IERC721(nftContract).safeTransferFrom(listing.seller, msg.sender, tokenId);

        // Xóa thông tin niêm yết
        delete fixedPriceListings[nftContract][tokenId];

        // Phát ra sự kiện bán hàng
        emit NFTSoldFixedPrice(nftContract, tokenId, listing.seller, msg.sender, listing.price);
    }

    // Hàm để tạo một phiên đấu giá
    function createAuction(
        address nftContract,
        uint256 tokenId,
        uint256 startPrice,
        uint256 duration
    ) external {
        require(startPrice > 0, "Start price must be greater than 0");
        require(
            IERC721(nftContract).ownerOf(tokenId) == msg.sender,
            "You are not the owner of this NFT"
        );
        require(
            IERC721(nftContract).getApproved(tokenId) == address(this) ||
            IERC721(nftContract).isApprovedForAll(msg.sender, address(this)),
            "Marketplace is not approved to transfer this NFT"
        );

        uint256 endTime = block.timestamp + duration;
        auctionListings[nftContract][tokenId] = AuctionListing({
            startPrice: startPrice,
            highestBid: startPrice,
            highestBidder: address(0),
            endTime: endTime,
            seller: msg.sender
        });

        emit AuctionCreated(nftContract, tokenId, msg.sender, startPrice, endTime);
    }

    // Hàm để đặt giá trong phiên đấu giá
    function placeBid(address nftContract, uint256 tokenId) external payable nonReentrant {
        AuctionListing storage auction = auctionListings[nftContract][tokenId];
        require(block.timestamp < auction.endTime, "Auction has ended");
        require(msg.value > auction.highestBid, "Bid must be higher than current highest bid");

        // Trả lại tiền cho người đặt giá trước đó
        if (auction.highestBidder != address(0)) {
            payable(auction.highestBidder).transfer(auction.highestBid);
        }

        // Cập nhật giá cao nhất và người đặt giá
        auction.highestBid = msg.value;
        auction.highestBidder = msg.sender;

        emit BidPlaced(nftContract, tokenId, msg.sender, msg.value);
    }

    // Hàm để kết thúc phiên đấu giá
    function endAuction(address nftContract, uint256 tokenId) external nonReentrant {
        AuctionListing memory auction = auctionListings[nftContract][tokenId];
        require(block.timestamp >= auction.endTime, "Auction has not ended yet");
        require(auction.seller == msg.sender, "Only the seller can end the auction");

        if (auction.highestBidder != address(0)) {
            // Tính toán phí marketplace và số tiền người bán nhận được
            uint256 feeAmount = (auction.highestBid * marketplaceFee) / 1000;
            uint256 sellerAmount = auction.highestBid - feeAmount;

            // Chuyển tiền cho người bán và phí cho marketplace
            payable(auction.seller).transfer(sellerAmount);
            payable(feeRecipient).transfer(feeAmount);

            // Chuyển NFT từ người bán sang người đặt giá cao nhất
            IERC721(nftContract).safeTransferFrom(auction.seller, auction.highestBidder, tokenId);
        } else {
            // Nếu không có ai đặt giá, trả lại NFT cho người bán
            IERC721(nftContract).safeTransferFrom(auction.seller, auction.seller, tokenId);
        }

        // Xóa thông tin đấu giá
        delete auctionListings[nftContract][tokenId];

        // Phát ra sự kiện kết thúc đấu giá
        emit AuctionEnded(nftContract, tokenId, auction.seller, auction.highestBidder, auction.highestBid);
    }

    // Hàm để cập nhật phí marketplace (chỉ owner có thể gọi)
    function updateMarketplaceFee(uint256 newFee) external onlyOwner {
        require(newFee <= 1000, "Fee cannot exceed 10%");
        marketplaceFee = newFee;
    }

    // Hàm để cập nhật địa chỉ nhận phí (chỉ owner có thể gọi)
    function updateFeeRecipient(address newRecipient) external onlyOwner {
        require(newRecipient != address(0), "Invalid recipient address");
        feeRecipient = newRecipient;
    }
}
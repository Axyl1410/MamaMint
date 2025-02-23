import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Listing } from './schemas/listing.schema';
import { NFT } from '../nft/entities/nft.entity';

@Injectable()
export class MarketplaceService {
  constructor(
    @InjectModel('Listing') private listingModel: Model<Listing>,
    @InjectModel('NFT') private nftModel: Model<NFT>,
  ) {
  }

  async listNFTFixedPrice(
    nftContract: string,
    tokenMetadata: any,
    price: string,
    seller: string,
  ) {

    const listing = new this.listingModel({
      nftContract,
      tokenMetadata: tokenMetadata,
      price,
      seller,
      type: 'fixed',
    });

    return listing.save();
  }

  async createAuction(
    nftContract: string,
    tokenId: number,
    startPrice: string,
    duration: number,
    seller: string,
  ) {
    const auction = new this.listingModel({
      nftContract,
      tokenId,
      price: startPrice,
      duration,
      seller,
      type: 'auction',
    });

    // Cập nhật NFT thành isListed = true
    await this.nftModel.findOneAndUpdate({ _id: tokenId }, { isListed: true });

    return auction.save();
  }

  async placeBid(
    nftContract: string,
    tokenId: number,
    bidder: string,
    bidAmount: string,
  ) {
    return this.listingModel.findOneAndUpdate(
      { nftContract, tokenId, type: 'auction' },
      { highestBid: bidAmount, highestBidder: bidder },
      { new: true },
    );
  }

  async endAuction(nftContract: string, tokenId: number, seller: string) {
    const auction = await this.listingModel.findOneAndDelete({
      nftContract,
      tokenId,
      type: 'auction',
      seller,
    });

    // Nếu tồn tại auction thì cập nhật NFT thành isListed = false
    if (auction) {
      await this.nftModel.findOneAndUpdate(
        { _id: tokenId },
        { isListed: false },
      );
    }

    return auction;
  }

  async cancelListing(nftContract: string, tokenId: number, seller: string) {
    const listing = await this.listingModel.findOneAndDelete({
      nftContract,
      tokenId,
      seller,
    });

    // Nếu tồn tại listing thì cập nhật NFT thành isListed = false
    if (listing) {
      await this.nftModel.findOneAndUpdate(
        { _id: tokenId },
        { isListed: false },
      );
    }

    return listing;
  }

  getAllListings() {
    return this.listingModel.find().exec();
  }

  getListing(nftContract: string, tokenId: number) {
    return this.listingModel.findOne({ nftContract, tokenId }).exec();
  }
}

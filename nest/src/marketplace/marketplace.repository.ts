// src/marketplace/repositories/listing.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Listing } from './schemas/listing.schema';
import { Auction } from './schemas/auction.schema';
import { Bid } from './schemas/bid.schema';

@Injectable()
export class MarketplaceRepository {
  constructor(
    @InjectModel('Listing') private readonly listingModel: Model<Listing>,
    @InjectModel('Auction') private readonly auctionModel: Model<Auction>,
    @InjectModel('Bid') private readonly bidModel: Model<Bid>,
  ) {}

  async create(listingData: {
    nftContract: string;
    tokenId: number;
    price: string;
    seller: string;
  }) {
    const listing = new this.listingModel(listingData);
    return listing.save();
  }

  async removeListing(nftContract: string, tokenId: number): Promise<void> {
    await this.listingModel.deleteOne({ nftContract, tokenId }).exec();
  }

  async findAll() {
    return this.listingModel.find().exec();
  }

  findById(id: string) {
    return this.listingModel.findById(id).exec();
  }

  async createAuction(auctionData: Partial<Auction>): Promise<Auction> {
    const auction = new this.auctionModel(auctionData);
    return auction.save();
  }

  async findAllAuctions(): Promise<Auction[]> {
    return this.auctionModel.find().exec();
  }

  async findAuctionById(id: string): Promise<Auction | null> {
    return this.auctionModel.findById(id).exec();
  }

  async createBid(bidData: Partial<Bid>): Promise<Bid> {
    const bid = new this.bidModel(bidData);
    return bid.save();
  }

  async findBidsByAuction(
    nftContract: string,
    tokenId: number,
  ): Promise<Bid[]> {
    return this.bidModel
      .find({ nftContract, tokenId })
      .sort({ timestamp: -1 })
      .exec();
  }

  async removeAuction(nftContract: string, tokenId: number): Promise<void> {
    await this.auctionModel.deleteOne({ nftContract, tokenId }).exec();
  }

  async findAuctionByNftAndTokenId(
    nftContract: string,
    tokenId: number,
  ): Promise<Auction | null> {
    return this.auctionModel.findOne({ nftContract, tokenId }).exec();
  }
}

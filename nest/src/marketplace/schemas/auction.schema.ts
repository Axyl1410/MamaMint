import { Schema, Document } from 'mongoose';

export interface Auction extends Document {
  nftContract: string;
  tokenId: number;
  startPrice: string; // Store price in Wei as a string
  duration: number; // Duration in seconds
  seller: string; // Seller's Ethereum address
  createdAt: Date;
  updatedAt: Date;
}

export const AuctionSchema = new Schema<Auction>(
  {
    nftContract: { type: String, required: true },
    tokenId: { type: Number, required: true },
    startPrice: { type: String, required: true },
    duration: { type: Number, required: true },
    seller: { type: String, required: true },
  },
  { timestamps: true },
);
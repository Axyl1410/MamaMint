import { Schema, Document } from 'mongoose';

export interface Bid extends Document {
  nftContract: string; // NFT contract address
  tokenId: number; // NFT token ID
  bidder: string; // Bidder's Ethereum address
  amount: string; // Bid amount in Wei
  timestamp: Date; // Timestamp of the bid
}

export const BidSchema = new Schema<Bid>({
  nftContract: { type: String, required: true },
  tokenId: { type: Number, required: true },
  bidder: { type: String, required: true },
  amount: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

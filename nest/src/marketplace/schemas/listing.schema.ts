import { Schema, Document } from 'mongoose';

export const ListingSchema = new Schema({
  nftContract: { type: String, required: true },
  tokenMetadata: { type: Object, required: true },
  seller: { type: String, required: true },
  price: { type: String, required: true },
  type: { type: String, enum: ['fixed', 'auction'], required: true },
  highestBid: { type: String, default: null },
  highestBidder: { type: String, default: null },
  duration: { type: Number, default: null },
  endTime: { type: Number, default: null },
  status: {
    type: String,
    enum: ['active', 'sold', 'canceled'],
    default: 'active',
  },
});

export interface Listing extends Document {
  nftContract: string;
  tokenMetadata: number;
  seller: string;
  price: string;
  type: 'fixed' | 'auction';
  highestBid?: string;
  highestBidder?: string;
  duration?: number;
  endTime?: number;
  status: 'active' | 'sold' | 'canceled';
}

import { Schema, Document, Types } from 'mongoose';

export const NFTSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  attributes: [
    {
      trait_type: { type: String, required: true },
      value: { type: String, required: true },
    },
  ],
  collectionId: {
    type: Types.ObjectId,
    ref: 'Collection',
    required: true,
  },
  ownerAddress: { type: String, required: true },
  tokenId: { type: Number, required: true },
  isListed: { type: Boolean, default: false },
});

export interface NFT extends Document {
  name: string;
  description: string;
  image: string;
  attributes: { trait_type: string; value: string }[];
  collectionId: any;
  tokenId: number;
  ownerAddress: string;
}

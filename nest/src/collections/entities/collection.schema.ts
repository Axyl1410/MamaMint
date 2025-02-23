import { Schema, Document } from 'mongoose';

export const CollectionSchema = new Schema({
  contractURI: { type: String, required: true },
  contractAddress: { type: String },
  effects: { type: Array },
  folderId: { type: String, required: true },
  userAddress: { type: String, required: true },
  mintPrice: { type: Number, required: true },
});

export interface Collection extends Document {
  contractURI: string;
  contractAddress: string;
  effects: any[];
  folderId: string;
  userAddress: string;
  mintPrice: number;
}

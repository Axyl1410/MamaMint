import { Document, Schema } from 'mongoose';

export const Activity = new Schema({
  id: { type: String, required: true },
  type: { type: String, required: true },
  itemId: { type: String, required: true },
  price: { type: String, required: true },
  from: { type: String, required: true },
  to: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

export interface Activity extends Document {
  id: string;
  type: string;
  item: string;
  price: string;
  from: string;
  to: string;
  timestamp: Date;
}

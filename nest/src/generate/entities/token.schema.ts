import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

@Schema()
export class Token extends Document {
  @Prop({ required: true })
  sessionId: string;

  @Prop({ required: true })
  id: string;

  @Prop({ required: true, type: SchemaTypes.Mixed }) // Fix: hỗ trợ object
  token: Record<string, any>;
}

export const TokenSchema = SchemaFactory.createForClass(Token);

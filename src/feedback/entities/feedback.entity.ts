import { Document, Schema, Types } from 'mongoose';

export const FeedbackSchema = new Schema(
  {
    chatId: { type: Number, required: true },
    rating: { type: Number, required: true },
    messageId: { type: Number, default: null },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    supporterId: {
      type: Schema.Types.ObjectId,
      ref: 'Supporter',
      required: false,
    },
  },
  { timestamps: true },
);

export interface FeedbackDocument extends Document {
  chatId: number;
  rating: number;
  messageId?: number;
  userId: Types.ObjectId;
  supporterId?: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

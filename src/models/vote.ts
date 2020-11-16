import mongoose from 'mongoose';
import { IVote } from '../interfaces/IVote';

const Vote = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    type: {
      type: String,
      enum: ['BEM', 'BPM', 'HIMA'],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export default mongoose.model<IVote & mongoose.Document>(
  'Vote',
  Vote,
);

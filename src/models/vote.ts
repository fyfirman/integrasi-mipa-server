import mongoose from 'mongoose';
import voteTypeConstant from '../constant/voteTypeConstant';
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
      enum: Object.keys(voteTypeConstant),
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export default mongoose.model<IVote & mongoose.Document>('Vote', Vote);

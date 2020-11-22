import mongoose from 'mongoose';
import { majorConstant } from '../constant';
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
    major: {
      type: String,
      enum: Object.keys(majorConstant),
    },
    batchYear: {
      type: String,
      required: true,
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

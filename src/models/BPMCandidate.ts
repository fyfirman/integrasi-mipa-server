import mongoose from 'mongoose';
import { majorConstant } from '../constant';
import { IBPMCandidate } from '../interfaces/IBPMCandidate';

const BPMcandidate = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    major: {
      type: String,
      enum: Object.keys(majorConstant),
    },
    batchYear: {
      type: Number,
      required: true,
    },
    photoPath: {
      type: String,
      required: true,
    },
  },
  { timestamps: false },
);

export default mongoose.model<IBPMCandidate & mongoose.Document>('BPMcandidate', BPMcandidate);

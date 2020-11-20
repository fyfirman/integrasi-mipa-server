import mongoose from 'mongoose';
import { majorConstant } from '../constant';
import { IBPMCandidate } from '../interfaces/IBPMCandidate';

const BPMcandidate = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    npm: {
      type: String,
      required: true,
    },
    number: {
      type: Number,
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
    vision: {
      type: String,
      required: true,
    },
    mission: {
      type: [{ _id: false, title: String, desc: String }],
      required: true,
    },
    photoPath: {
      type: String,
      required: true,
    },
  },
  { timestamps: false },
);

BPMcandidate.index({ number: 1, major: 1 }, { unique: true });

export default mongoose.model<IBPMCandidate & mongoose.Document>('BPMcandidate', BPMcandidate);

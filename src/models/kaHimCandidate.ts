import mongoose from 'mongoose';
import { majorConstant } from '../constant';
import { IKaHimCandidate } from '../interfaces/IKaHimCandidate';

const candidateProfile = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    npm: {
      type: String,
      required: true,
    },
    batchYear: {
      type: Number,
      required: true,
    },
  },
  { _id: false },
);

const KaHimCandidate = new mongoose.Schema(
  {
    number: {
      type: Number,
      required: true,
    },
    major: {
      type: String,
      enum: Object.keys(majorConstant),
    },
    npm: {
      type: String,
      required: true,
    },
    chairman: candidateProfile,
    hasViceChairman: { type: Boolean },
    viceChairman: candidateProfile,
    vision: {
      type: String,
      required: true,
    },
    mission: {
      type: [{ _id: false, title: String, desc: String }],
      required: true,
    },
    proker: {
      type: [String],
      required: true,
    },
    photoPath: {
      type: String,
      required: true,
    },
  },
  { timestamps: false },
);

KaHimCandidate.index({ number: 1, major: 1 }, { unique: true });

export default mongoose.model<IKaHimCandidate & mongoose.Document>(
  'KaHimCandidate',
  KaHimCandidate,
);

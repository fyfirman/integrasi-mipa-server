import mongoose from 'mongoose';
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
      unique: true,
      index: true,
      required: true,
    },
    chairman: candidateProfile,
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

export default mongoose.model<IKaHimCandidate & mongoose.Document>(
  'KaHimCandidate',
  KaHimCandidate,
);

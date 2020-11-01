import mongoose from 'mongoose';
import { IKaBEMcandidate } from '../interfaces/IKaBEMcandidate';

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

const KaBEMcandidate = new mongoose.Schema(
  {
    number: {
      type: Number,
      index: true,
      required: true,
    },
    chairman: candidateProfile,
    viceChairman: candidateProfile,
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

export default mongoose.model<IKaBEMcandidate & mongoose.Document>(
  'KaBEMcandidate',
  KaBEMcandidate,
);

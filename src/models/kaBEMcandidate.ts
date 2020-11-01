import mongoose from 'mongoose';
import { IKaBEMcandidate } from '../interfaces/IKaBEMcandidate';

const KaBEMcandidate = new mongoose.Schema(
  {
    number: {
      type: Number,
      index: true,
    },
    chairman: {
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
    viceChairman: {
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
    vision: {
      type: String,
      required: true,
    },
    mission: {
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

export default mongoose.model<IKaBEMcandidate & mongoose.Document>(
  'KaBEMcandidate',
  KaBEMcandidate,
);

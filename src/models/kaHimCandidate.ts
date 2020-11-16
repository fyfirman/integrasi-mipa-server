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
      required: true,
    },
    major: {
      type: String,
      enum: ['TI', 'TE', 'MAT', 'BIO', 'FIS', 'AKTU', 'KIM', 'GEO', 'STAT'],
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

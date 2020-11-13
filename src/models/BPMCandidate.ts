import mongoose from 'mongoose';
import { IBPMCandidate } from '../interfaces/IBPMCandidate';

const BPMcandidate = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    major: {
      type: String,
      enum: ['TI', 'TE', 'MAT', 'BIO', 'FIS', 'AKTU', 'KIM', 'GEO', 'STAT'],
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

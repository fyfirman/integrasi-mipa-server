import mongoose from 'mongoose';
import { ICardVerification } from '../interfaces/ICardVerification';

const CardVerification = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    selfiePhotoPath: {
      type: String,
      required: true,
    },
    hasBeenVerified: {
      type: Boolean,
      default: false,
    },
    isAccepted: {
      type: Boolean,
      default: false,
    },
    purpose: {
      type: String,
      enum: ['ACTIVATE_ACCOUNT', 'VERIFY_BEM_VOTE', 'VERIFY_BPM_VOTE', 'VERIFY_HIMA_VOTE'],
      required: true,
    },
    major: {
      type: String,
      enum: ['TI', 'TE', 'MAT', 'BIO', 'FIS', 'AKTU', 'KIM', 'GEO', 'STAT'],
    },
    verifiedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

CardVerification.index({ userId: 1, purpose: 1 }, { unique: true });

export default mongoose.model<ICardVerification & mongoose.Document>(
  'CardVerification',
  CardVerification,
);

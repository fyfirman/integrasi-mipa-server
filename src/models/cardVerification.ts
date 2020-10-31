import mongoose from 'mongoose';
import { ICardVerification } from '../interfaces/ICardVerification';

const CardVerification = new mongoose.Schema(
  {
    userId: {
      type: String,
      unique: true,
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
    verifiedDate: {
      type: Date,
    },
  },
  { timestamps: true },
);

export default mongoose.model<ICardVerification & mongoose.Document>(
  'CardVerification',
  CardVerification,
);

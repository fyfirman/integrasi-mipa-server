import mongoose from 'mongoose';
import { majorConstant, purposeVerifConstant } from '../constant';
import { ICardVerification } from '../interfaces/ICardVerification';

const CardVerification = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
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
      enum: Object.keys(purposeVerifConstant),
      required: true,
    },
    major: {
      type: String,
      enum: Object.keys(majorConstant),
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

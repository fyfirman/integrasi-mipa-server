import mongoose from 'mongoose';
import { ICardVerification } from '../interfaces/ICardVerification';

const IdCardVerification = new mongoose.Schema(
  {
    userId: {
      type: String,
      unique: true,
    },
    selfiePhotoPath: {
      type: String,
    },
    status: {
      type: Boolean,
    },
  },
  { timestamps: true },
);

export default mongoose.model<ICardVerification & mongoose.Document>(
  'IdCardVerification',
  IdCardVerification,
);

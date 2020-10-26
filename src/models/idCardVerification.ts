import mongoose from 'mongoose';
import { IIdCardVerification } from '../interfaces/IIdCardVerification';

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

export default mongoose.model<IIdCardVerification & mongoose.Document>(
  'IdCardVerification',
  IdCardVerification,
);

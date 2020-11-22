import mongoose from 'mongoose';
import { IDumpPassword } from '../interfaces/IDumpPassword';

const DumpPassword = new mongoose.Schema(
  {
    cardVerificationId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    password: String,
    salt: String,
  },
  { timestamps: true },
);

export default mongoose.model<IDumpPassword & mongoose.Document>('DumpPassword', DumpPassword);

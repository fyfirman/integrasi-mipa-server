import mongoose from 'mongoose';
import { majorConstant, roleConstant } from '../constant';
import { IUser } from '../interfaces/IUser';

const User = new mongoose.Schema(
  {
    npm: {
      type: String,
      lowercase: true,
      unique: true,
      index: true,
    },
    password: String,
    salt: String,
    name: {
      type: String,
      required: [true, 'Please enter a full name'],
    },
    role: {
      type: String,
      enum: Object.keys(roleConstant),
      default: 'USER',
    },
    major: {
      type: String,
      enum: Object.keys(majorConstant),
    },
    batchYear: String,
    himaPermission: {
      type: Boolean,
      required: true,
    },
    mipaPermission: {
      type: Boolean,
      required: true,
    },
    isPasswordChanged: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    hasUpload: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: false },
);

export default mongoose.model<IUser & mongoose.Document>('User', User);

import mongoose from 'mongoose';
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
      enum: ['USER', 'ADMIN', 'ADMIN_MIPA'],
      default: 'USER',
    },
    major: {
      type: String,
      enum: ['TI', 'TE', 'MAT', 'BIO', 'FIS', 'AKTU', 'KIM', 'GEO', 'STAT'],
    },
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
  },
  { timestamps: false },
);

export default mongoose.model<IUser & mongoose.Document>('User', User);

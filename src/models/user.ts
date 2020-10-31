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
      enum: ['USER', 'ADMIN'],
      default: 'USER',
    },
    major: {
      type: String,
      enum: ['TI', 'TE', 'MAT', 'BIO', 'FIS', 'AKTU', 'KIM', 'GEO'],
    },
  },
  { timestamps: false },
);

export default mongoose.model<IUser & mongoose.Document>('User', User);

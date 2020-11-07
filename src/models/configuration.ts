import mongoose from 'mongoose';
import { IConfiguration } from '../interfaces/IConfiguration';

const Configuration = new mongoose.Schema({
  configName: {
    type: String,
    unique: true,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model<IConfiguration & mongoose.Document>('Configuration', Configuration);

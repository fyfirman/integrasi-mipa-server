import { Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import mongoose from 'mongoose';
import { RestError } from '../../helpers/error';
import { IUser } from '../../interfaces/IUser';

const attachCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const UserModel = Container.get('userModel') as mongoose.Model<IUser & mongoose.Document>;
    const userRecord = await UserModel.findById(req.user._id);
    if (!userRecord) {
      throw new RestError(401, 'User not found');
    }
    const currentUser = userRecord.toObject();
    Reflect.deleteProperty(currentUser, 'password');
    Reflect.deleteProperty(currentUser, 'salt');
    req.currentUser = currentUser;
    next();
  } catch (error) {
    next(error);
  }
};

export default attachCurrentUser;

import { Request, NextFunction } from 'express';
import { RestError } from '../../helpers/error';

const isVerified = (req: Request, res: Response, next: NextFunction): void => {
  if (req.currentUser === undefined) {
    throw new RestError(500, 'Endpoint should be attach current user');
  }

  if (!req.currentUser.isVerified) {
    throw new RestError(403, 'You\'re not allowed to access. Please verify your account');
  }

  next();
};

export default isVerified;

import { Request, Response, NextFunction } from 'express';
import path from 'path';
import base64Img from 'base64-img';
import { RestError } from '../../helpers/error';

const attachCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const base64 = req.body.selfiePhoto;
    const destinationPath = path.join(
      __dirname,
      `/../../../public/uploads/verification/${req.body.purpose}`,
    );

    base64Img.img(
      base64,
      destinationPath,
      `${req.currentUser.npm}-${Date.now()}`,
      (err, photoPath) => {
        if (err) {
          throw new RestError(500, 'Error saving images');
        }

        req.photoPath = photoPath;
        next();
      },
    );
  } catch (error) {
    next(error);
  }
};

export default attachCurrentUser;

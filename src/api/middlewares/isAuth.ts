import jwt from 'jsonwebtoken';
import { Request, NextFunction } from 'express';
import { RestError } from '../../helpers/error';
import config from '../../config';

const getTokenFromHeader = (req : Request) => {
  if (
    (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token')
    || (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer')
  ) {
    return req.headers.authorization.split(' ')[1];
  }
  return null;
};

const isAuth = (req: Request, res: Response, next: NextFunction) : void => {
  jwt.verify(getTokenFromHeader(req), config.jwtSecret, (error: any, user: any) => {
    if (error) {
      throw new RestError(403, 'Authenticate is failed');
    }
    req.user = user;
    next();
  });
};

export default isAuth;

import { Container } from 'typedi';
import {
  Router, Request, Response, NextFunction,
} from 'express';

import middlewares from '../middlewares';
import UserService from '../../services/user';
import logResponse from '../../helpers/logResponse';

const route = Router();

export default (app: Router): void => {
  app.use('/user', route);

  route.get('/', middlewares.isAuth, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userServiceInstance: UserService = Container.get(UserService);

      const skip = parseInt(req.query.skip, 10);
      const limit = parseInt(req.query.limit, 10);

      let users = null;
      await userServiceInstance.getAll(skip, limit).then((userRecords) => {
        users = userRecords;
      });

      const filteredUser = users.map((user) => {
        const userObject = user.toObject();
        Reflect.deleteProperty(userObject, 'password');
        Reflect.deleteProperty(userObject, 'salt');
        return userObject;
      });

      const message = 'Users found';
      res
        .json({
          success: true,
          message,
          data: { users: filteredUser },
        })
        .status(200);
      logResponse(req, res, message);
    } catch (error) {
      next(error);
    }
  });

  route.get(
    '/me',
    middlewares.isAuth,
    middlewares.attachCurrentUser,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const message = 'User found';
        res.json({ success: true, message, data: { user: req.currentUser } }).status(200);
        logResponse(req, res, message);
      } catch (error) {
        next(error);
      }
    },
  );
};

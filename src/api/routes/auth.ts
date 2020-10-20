import {
  Router, Request, Response, NextFunction,
} from 'express';
import { Container } from 'typedi';
import { celebrate, Joi } from 'celebrate';
import { IUserInputDTO } from '../../interfaces/IUser';
import AuthService from '../../services/auth';
import logResponse from '../../helpers/logResponse';

const route = Router();

export default (app: Router): void => {
  app.use('/auth', route);

  route.post(
    '/register',
    celebrate({
      body: Joi.object({
        npm: Joi.string().required(),
        password: Joi.string().required(),
        confirmPassword: Joi.string().required(),
        name: Joi.string().required(),
        major: Joi.string().required(),
      }),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const authServiceInstance: AuthService = Container.get(AuthService);

        if (req.query.check === 'true' || req.query.check === '') {
          const isRegistered = await authServiceInstance.checkRegistered(req.body.npm);

          const message = 'npm checked';
          res.json({ success: true, message, data: { isRegistered } }).status(201);
          logResponse(req, res, message);
        } else {
          const { user } = await authServiceInstance.SignUp(req.body as IUserInputDTO);
          const message = 'Created successfully';
          res.json({ success: true, message, data: { user } }).status(201);
          logResponse(req, res, message);
        }
      } catch (error) {
        next(error);
      }
    },
  );

  route.post(
    '/login',
    celebrate({
      body: Joi.object({
        npm: Joi.string().required(),
        password: Joi.string().required(),
      }),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { npm, password } = req.body;
        const authServiceInstance: AuthService = Container.get(AuthService);

        const { user, token } = await authServiceInstance.SignIn(npm, password);

        const message = 'Successfully logged in';
        res.json({ success: true, message, data: { user, token } }).status(200);
        logResponse(req, res, message);
      } catch (error) {
        next(error);
      }
    },
  );
};

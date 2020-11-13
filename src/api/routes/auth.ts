import {
  Router, Request, Response, NextFunction,
} from 'express';
import { Container } from 'typedi';
import { celebrate, Joi } from 'celebrate';
import { IUserInputDTO, changePasswordUserDTO } from '../../interfaces/IUser';
import middlewares from '../middlewares';
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
        name: Joi.string().required(),
        himaPermission: Joi.boolean().required(),
        mipaPermission: Joi.boolean().required(),
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
          res.json({ success: true, message, data: user }).status(201);
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

  route.put(
    '/changePassword',
    celebrate({
      body: Joi.object({
        oldPassword: Joi.string().required().min(8),
        newPassword: Joi.string().required().min(8),
        confirmNewPassword: Joi.string()
          .valid(Joi.ref('newPassword'))
          .required()
          .options({ messages: { 'any.only': '{{#label}} does not match' } }),
      }),
    }),
    middlewares.isAuth,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const authServiceInstance: AuthService = Container.get(AuthService);

        const userInput = {
          id: req.user._id,
          ...req.body,
        };

        let userRecord = null;
        await authServiceInstance
          .changePassword(userInput as changePasswordUserDTO)
          .then((result) => {
            userRecord = result;
          });

        const user = userRecord.toObject();
        Reflect.deleteProperty(user, 'password');
        Reflect.deleteProperty(user, 'salt');

        const message = 'User password is successfully changed';
        res.json({ success: true, message, data: user }).status(200);
        logResponse(req, res, message);
      } catch (error) {
        next(error);
      }
    },
  );
};

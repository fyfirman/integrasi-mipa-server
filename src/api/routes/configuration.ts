import { Container } from 'typedi';
import {
  Router, Request, Response, NextFunction,
} from 'express';
import { celebrate, Joi } from 'celebrate';
import { IConfigurationDTO } from '../../interfaces/IConfiguration';

import middlewares from '../middlewares';
import logResponse from '../../helpers/logResponse';
import ConfigurationService from '../../services/configuration';

const route = Router();

export default (app: Router): void => {
  app.use('/config', route);

  const configurationService: ConfigurationService = Container.get(ConfigurationService);

  route.get('/', middlewares.isAuth, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await configurationService.getAll();

      const message = 'Configurations found';
      res.status(200).json({
        success: true,
        message,
        data: result,
      });
      logResponse(req, res, message);
    } catch (error) {
      next(error);
    }
  });

  route.get('/:id', middlewares.isAuth, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await configurationService.get(req.params.id);

      let message = '';
      if (result !== null) {
        message = 'Configuration record found';
        res.status(200).json({ success: true, message, data: result });
      } else {
        message = 'Configuration record is not found';
        res.status(404).json({ success: false, message, data: result });
      }
      logResponse(req, res, message);
    } catch (error) {
      next(error);
    }
  });

  route.post(
    '/',
    middlewares.isAuth,
    celebrate({
      body: Joi.object({
        configName: Joi.string().required(),
        isActive: Joi.boolean().required(),
      }),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const configuration = await configurationService.create(req.body as IConfigurationDTO);

        const message = 'Configuration record is created';
        res.status(201).json({
          success: true,
          message,
          data: configuration,
        });
        logResponse(req, res, message);
      } catch (error) {
        next(error);
      }
    },
  );

  route.put(
    '/',
    middlewares.isAuth,
    celebrate({
      body: Joi.object({
        configName: Joi.string().required(),
        isActive: Joi.boolean().required(),
      }),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await configurationService.edit(req.body as IConfigurationDTO);

        const message = 'Configuration record is updated';
        res.status(200).json({
          success: true,
          message,
          data: result,
        });
        logResponse(req, res, message);
      } catch (error) {
        next(error);
      }
    },
  );

  route.delete(
    '/:id',
    middlewares.isAuth,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await configurationService.delete(req.params.id);
        let message = '';
        if (result) {
          message = 'Configuration record has been deleted';
          res.status(200).json({
            success: true,
            message,
          });
        } else {
          message = 'Configuration not found. Record is not deleted';
          res.status(404).json({
            success: false,
            message,
          });
        }

        logResponse(req, res, message);
      } catch (error) {
        next(error);
      }
    },
  );
};

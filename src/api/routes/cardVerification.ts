import { Container } from 'typedi';
import {
  Router, Request, Response, NextFunction,
} from 'express';
import { Logger } from 'winston';
import { celebrate, Joi } from 'celebrate';
import middlewares from '../middlewares';
import { ICardVerificationInputDTO } from '../../interfaces/ICardVerification';
import logResponse from '../../helpers/logResponse';
import CardVerificationService from '../../services/cardVerification';

const route = Router();

export default (app: Router): void => {
  app.use('/verification/card', route);

  const cardVerificationService: CardVerificationService = Container.get(CardVerificationService);

  route.get('/', middlewares.isAuth, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const skip = parseInt(req.query.skip, 10);
      const limit = parseInt(req.query.limit, 10);

      let verificationRecords = null;
      await cardVerificationService.getAll(skip, limit).then((idCardVerifications) => {
        verificationRecords = idCardVerifications;
      });

      const message = 'Card verification record found';
      res
        .json({
          success: true,
          message,
          data: { verificationRecords },
        })
        .status(200);
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
        selfiePhoto: Joi.string().required(),
      }),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const logger: Logger = Container.get('logger');
        logger.debug(req.body);

        const verificationRecord = await cardVerificationService.create(
          req.body as ICardVerificationInputDTO,
        );

        const message = 'Card verification record created';
        res
          .json({
            success: true,
            message,
            data: { verificationRecord },
          })
          .status(200);
        logResponse(req, res, message);
      } catch (error) {
        next(error);
      }
    },
  );
};

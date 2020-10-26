import { Container } from 'typedi';
import {
  Router, Request, Response, NextFunction,
} from 'express';
import multer from 'multer';
import diskStorage from '../../config/multer';
import middlewares from '../middlewares';
import { ICardVerificationInputDTO } from '../../interfaces/ICardVerification';
import logResponse from '../../helpers/logResponse';
import CardVerificationService from '../../services/cardVerification';

const route = Router();

const upload = multer({ storage: diskStorage });

export default (app: Router): void => {
  app.use('/verification/card', route);

  const cardVerificationService: CardVerificationService = Container.get(CardVerificationService);

  route.get('/', middlewares.isAuth, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const skip = parseInt(req.query.skip, 10);
      const limit = parseInt(req.query.limit, 10);

      let verificationRecords = null;
      await cardVerificationService.getAll(skip, limit).then((cardVerifications) => {
        verificationRecords = cardVerifications;
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

  route.get('/:id', middlewares.isAuth, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cardVerificationRecord = await cardVerificationService.get(req.params.id);

      const message = 'Card verification record found';
      res.json({ success: true, message, data: { cardVerificationRecord } }).status(200);
      logResponse(req, res, message);
    } catch (error) {
      next(error);
    }
  });

  route.post(
    '/',
    middlewares.isAuth,
    upload.single('selfiePhoto'),
    middlewares.attachCurrentUser,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const cardVerificationInput = {
          userId: req.currentUser._id,
          selfiePhotoPath: req.file.path,
        };

        const verificationRecord = await cardVerificationService.create(
          cardVerificationInput as ICardVerificationInputDTO,
        );

        const message = 'Card verification record created';
        res.status(201).json({
          success: true,
          message,
          data: { verificationRecord },
        });
        logResponse(req, res, message);
      } catch (error) {
        next(error);
      }
    },
  );

  // route.put('/verify', middlewares.isAuth, async (req: Request, res: Response, next: NextFunction) => {
  //   try {

  //   } catch (error) {

  //   }
  // });
};

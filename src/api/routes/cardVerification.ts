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

      const verificationRecords = await cardVerificationService.getAll(skip, limit);

      let message = '';
      if (verificationRecords !== null) {
        message = 'Card verification record found';
        res.status(200).json({
          success: true,
          message,
          data: { verificationRecords },
        });
      } else {
        message = 'Card verification record not found';
        res.status(200).json({
          success: true,
          message,
          data: { verificationRecords: [] },
        });
      }
      logResponse(req, res, message);
    } catch (error) {
      next(error);
    }
  });

  route.get('/:id', middlewares.isAuth, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cardVerificationRecord = await cardVerificationService.get(req.params.id);

      let message = '';
      if (cardVerificationRecord !== null) {
        message = 'Card verification record found';
        res.status(200).json({ success: true, message, data: { cardVerificationRecord } });
      } else {
        message = 'Card verification record not found';
        res.status(404).json({ success: false, message, data: { cardVerificationRecord } });
      }
      logResponse(req, res, message);
    } catch (error) {
      next(error);
    }
  });

  route.post(
    '/',
    middlewares.isAuth,
    upload.single('selfiePhoto'),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const cardVerificationInput = {
          userId: req.user._id,
          selfiePhotoPath: req.file.path,
          purpose: req.body.purpose,
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

  route.put(
    '/verify/:id',
    middlewares.isAuth,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        await cardVerificationService.verify(req.params.id, req.body.isAccepted);
        const verificationRecord = await cardVerificationService.get(req.params.id);

        const message = req.body.isAccepted
          ? 'Card verification has been accepted'
          : 'Card verification has been declined';

        res.status(200).json({
          success: true,
          message,
          verificationRecord,
        });

        logResponse(req, res, message);
      } catch (error) {
        next(error);
      }
    },
  );

  route.delete(
    '/',
    middlewares.isAuth,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await cardVerificationService.delete(req.user._id);
        let message = '';
        if (result) {
          message = 'Card verification record has been deleted';
          res.status(200).json({
            success: true,
            message,
          });
        } else {
          message = 'User not found. Record is not deleted';
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

import { Container } from 'typedi';
import {
  Router, Request, Response, NextFunction,
} from 'express';

import multer from 'multer';
import { IKaBEMcandidate, IKaBEMcandidateDTO } from '../../interfaces/IKaBEMcandidate';
import diskStorage from '../../config/multer';

import middlewares from '../middlewares';
import logResponse from '../../helpers/logResponse';
import KaBEMcandidateService from '../../services/kaBEMCandidate';

const route = Router();

const upload = multer({ storage: diskStorage });

export default (app: Router): void => {
  app.use('/candidate/bem', route);

  const kaBEMcandidateService: KaBEMcandidateService = Container.get(KaBEMcandidateService);

  route.get('/', middlewares.isAuth, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const skip = parseInt(req.query.skip, 10);
      const limit = parseInt(req.query.limit, 10);

      const kaBEMCandidates = await kaBEMcandidateService.getAll(skip, limit);
      const message = 'KaBEM candidates found';
      res.status(200).json({
        success: true,
        message,
        data: kaBEMCandidates,
      });
      logResponse(req, res, message);
    } catch (error) {
      next(error);
    }
  });

  route.post(
    '/',
    middlewares.isAuth,
    upload.single('photo'),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const candidateInput = {
          ...req.body,
          photoPath: req.file.path,
        };

        const kaBEMCandidate = await kaBEMcandidateService.create(
          candidateInput as IKaBEMcandidateDTO,
        );

        const message = 'KaBEM Candidate record is created';
        res.status(201).json({
          success: true,
          message,
          data: kaBEMCandidate,
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
    upload.single('photo'),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        let candidateInput = {};
        if (req.file !== undefined) {
          candidateInput = {
            ...req.body,
            photoPath: req.file.path,
          };
        } else {
          candidateInput = req.body;
        }

        const kaBEMCandidate = await kaBEMcandidateService.edit(candidateInput as IKaBEMcandidate);

        const message = 'KaBEM Candidate record is updated';
        res.status(200).json({
          success: true,
          message,
          data: kaBEMCandidate,
        });
        logResponse(req, res, message);
      } catch (error) {
        next(error);
      }
    },
  );
};

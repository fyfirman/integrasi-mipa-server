import { Container } from 'typedi';
import {
  Router, Request, Response, NextFunction,
} from 'express';

import multer from 'multer';
import { IBPMCandidate, IBPMCandidateDTO } from '../../interfaces/IBPMCandidate';
import diskStorage from '../../config/multer';

import middlewares from '../middlewares';
import logResponse from '../../helpers/logResponse';
import BPMCandidateService from '../../services/BPMCandidate';

const route = Router();

const upload = multer({ storage: diskStorage });

export default (app: Router): void => {
  app.use('/candidate/bpm', route);

  const BPMService: BPMCandidateService = Container.get(BPMCandidateService);

  route.get('/', middlewares.isAuth, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const skip = parseInt(req.query.skip, 10);
      const limit = parseInt(req.query.limit, 10);

      const kaBEMCandidates = await BPMService.getAll(skip, limit);
      const message = 'BPM candidates found';
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

  route.get('/:id', middlewares.isAuth, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const kaBEMcandidate = await BPMService.get(req.params.id);

      let message = '';
      if (kaBEMcandidate !== null) {
        message = 'BPM candidate record found';
        res.status(200).json({ success: true, message, data: kaBEMcandidate });
      } else {
        message = 'BPM candidate record not found';
        res.status(404).json({ success: false, message, data: kaBEMcandidate });
      }
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

        const kaBEMCandidate = await BPMService.create(candidateInput as IBPMCandidateDTO);

        const message = 'BPM candidate record is created';
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

        const kaBEMCandidate = await BPMService.edit(candidateInput as IBPMCandidate);

        const message = 'BPM candidate record is updated';
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

  route.delete(
    '/:id',
    middlewares.isAuth,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await BPMService.delete(req.params.id);
        let message = '';
        if (result) {
          message = 'BPM candidate record has been deleted';
          res.status(200).json({
            success: true,
            message,
          });
        } else {
          message = 'BPM candidate not found. Record is not deleted';
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

/* eslint-disable dot-notation */
import { Container } from 'typedi';
import {
  Router, Request, Response, NextFunction,
} from 'express';

import multer from 'multer';
import { addBaseURL, removeDirName } from '../../helpers/urlHelper';

import { IKaBEMcandidate, IKaBEMcandidateDTO } from '../../interfaces/IKaBEMcandidate';
import diskStorage from '../../config/multer';

import middlewares from '../middlewares';
import logResponse from '../../helpers/logResponse';
import KaBEMcandidateService from '../../services/kaBEMCandidate';

const route = Router();

const upload = multer({ storage: diskStorage.candidateStorage });

export default (app: Router): void => {
  app.use('/candidate/bem', route);

  const kaBEMcandidateService: KaBEMcandidateService = Container.get(KaBEMcandidateService);

  route.get('/', middlewares.isAuth, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const skip = parseInt(req.query.skip, 10);
      const limit = parseInt(req.query.limit, 10);

      const kaBEMCandidates = await kaBEMcandidateService.getAll(skip, limit);

      const data = [];
      kaBEMCandidates.forEach((record) => {
        data.push({
          ...record['_doc'],
          photoPath: addBaseURL(record.photoPath),
        });
      });

      const message = 'KaBEM candidates found';
      res.status(200).json({
        success: true,
        message,
        data,
      });
      logResponse(req, res, message);
    } catch (error) {
      next(error);
    }
  });

  route.get('/:id', middlewares.isAuth, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const kaBEMcandidate = await kaBEMcandidateService.get(req.params.id);

      let message = '';
      if (kaBEMcandidate !== null) {
        message = 'KaBEM candidate record found';
        const data = {
          ...kaBEMcandidate['_doc'],
          photoPath: addBaseURL(kaBEMcandidate.photoPath),
        };
        res.status(200).json({ success: true, message, data });
      } else {
        message = 'KaBEM candidate record not found';
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
          photoPath: removeDirName(req.file.path),
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
            photoPath: removeDirName(req.file.path),
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

  route.delete(
    '/:id',
    middlewares.isAuth,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await kaBEMcandidateService.delete(req.params.id);
        let message = '';
        if (result) {
          message = 'KaBEM Candidate record has been deleted';
          res.status(200).json({
            success: true,
            message,
          });
        } else {
          message = 'KaBEM Candidate not found. Record is not deleted';
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

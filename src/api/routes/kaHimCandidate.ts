/* eslint-disable dot-notation */
import { Container } from 'typedi';
import {
  Router, Request, Response, NextFunction,
} from 'express';

import multer from 'multer';
import { removeDirName, addBaseURL } from '../../helpers/urlHelper';

import { IKaHimCandidate, IKaHimCandidateDTO } from '../../interfaces/IKaHimCandidate';
import diskStorage from '../../config/multer';

import middlewares from '../middlewares';
import logResponse from '../../helpers/logResponse';
import KaHimCandidateService from '../../services/kaHimCandidate';

const route = Router();

const upload = multer({ storage: diskStorage.candidateStorage });

export default (app: Router): void => {
  app.use('/candidate/hima', route);

  const kaHimCandidateService: KaHimCandidateService = Container.get(KaHimCandidateService);

  route.get('/', middlewares.isAuth, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const skip = parseInt(req.query.skip, 10);
      const limit = parseInt(req.query.limit, 10);
      const { major } = req.query;

      const kaHimCandidates = await kaHimCandidateService.getAll(skip, limit, major);

      const data = [];
      kaHimCandidates.forEach((record) => {
        data.push({
          ...record['_doc'],
          photoPath: addBaseURL(record.photoPath),
        });
      });

      const message = 'KaHim candidates found';
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
      const kaHimCandidate = await kaHimCandidateService.get(req.params.id);

      let message = '';
      if (kaHimCandidate !== null) {
        message = 'KaHim candidate record found';
        const data = {
          ...kaHimCandidate['_doc'],
          photoPath: addBaseURL(kaHimCandidate.photoPath),
        };
        res.status(200).json({ success: true, message, data });
      } else {
        message = 'KaHim candidate record not found';
        res.status(404).json({ success: false, message, data: kaHimCandidate });
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

        const kaHimCandidate = await kaHimCandidateService.create(
          candidateInput as IKaHimCandidateDTO,
        );

        const data = {
          ...kaHimCandidate['_doc'],
          photoPath: addBaseURL(kaHimCandidate.photoPath),
        };

        const message = 'KaHim Candidate record is created';
        res.status(201).json({
          success: true,
          message,
          data,
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

        const kaHimCandidate = await kaHimCandidateService.edit(candidateInput as IKaHimCandidate);

        const data = {
          ...kaHimCandidate['_doc'],
          photoPath: addBaseURL(kaHimCandidate.photoPath),
        };

        const message = 'KaHim Candidate record is updated';
        res.status(200).json({
          success: true,
          message,
          data,
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
        const result = await kaHimCandidateService.delete(req.params.id);
        let message = '';
        if (result) {
          message = 'KaHim Candidate record has been deleted';
          res.status(200).json({
            success: true,
            message,
          });
        } else {
          message = 'KaHim Candidate not found. Record is not deleted';
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

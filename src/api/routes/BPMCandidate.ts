/* eslint-disable dot-notation */
import { Container } from 'typedi';
import {
  Router, Request, Response, NextFunction,
} from 'express';

import multer from 'multer';
import { removeDirName, addBaseURL } from '../../helpers/urlHelper';

import { IBPMCandidate, IBPMCandidateDTO } from '../../interfaces/IBPMCandidate';
import diskStorage from '../../config/multer';

import middlewares from '../middlewares';
import logResponse from '../../helpers/logResponse';
import BPMCandidateService from '../../services/BPMCandidate';

const route = Router();

const upload = multer({ storage: diskStorage.candidateStorage });

export default (app: Router): void => {
  app.use('/candidate/bpm', route);

  const BPMService: BPMCandidateService = Container.get(BPMCandidateService);

  route.get('/', middlewares.isAuth, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const skip = parseInt(req.query.skip, 10);
      const limit = parseInt(req.query.limit, 10);

      const kaBEMCandidates = await BPMService.getAll(skip, limit);

      const data = [];
      kaBEMCandidates.forEach((record) => {
        data.push({
          ...record['_doc'],
          photoPath: addBaseURL(record.photoPath),
        });
      });

      const message = 'BPM candidates found';
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
      const kaBEMcandidate = await BPMService.get(req.params.id);

      let message = '';
      if (kaBEMcandidate !== null) {
        const data = {
          ...kaBEMcandidate['_doc'],
          photoPath: addBaseURL(kaBEMcandidate.photoPath),
        };
        message = 'BPM candidate record found';
        res.status(200).json({ success: true, message, data });
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
    middlewares.attachCurrentUser,
    middlewares.isAdminMIPA,
    upload.single('photo'),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const candidateInput = {
          ...req.body,
          photoPath: removeDirName(req.file.path),
        };

        const kaBEMCandidate = await BPMService.create(candidateInput as IBPMCandidateDTO);

        const data = {
          ...kaBEMCandidate['_doc'],
          photoPath: addBaseURL(kaBEMCandidate.photoPath),
        };

        const message = 'BPM candidate record is created';
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
    middlewares.attachCurrentUser,
    middlewares.isAdminMIPA,
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

        const kaBEMCandidate = await BPMService.edit(candidateInput as IBPMCandidate);

        const data = {
          ...kaBEMCandidate,
          photoPath: addBaseURL(kaBEMCandidate.photoPath),
        };

        const message = 'BPM candidate record is updated';
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
    middlewares.attachCurrentUser,
    middlewares.isAdminMIPA,
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

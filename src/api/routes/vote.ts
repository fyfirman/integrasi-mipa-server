import { Container } from 'typedi';
import {
  Router, Request, Response, NextFunction,
} from 'express';
import { RestError } from '../../helpers/error';
import { IVote, IVoteDTO } from '../../interfaces/IVote';
import middlewares from '../middlewares';
import logResponse from '../../helpers/logResponse';
import VoteService from '../../services/vote';

const route = Router();

export default (app: Router): void => {
  app.use('/vote', route);

  const voteService: VoteService = Container.get(VoteService);

  route.get('/', middlewares.isAuth, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        type, candidateId, start, end,
      } = req.query;

      let result;
      if (candidateId !== undefined) {
        result = await voteService.getResultByCandidate(candidateId);
      } else if (type !== undefined) {
        if (start !== undefined && end !== undefined) {
          result = await voteService.getResultByType(type, new Date(start), new Date(end));
        } else {
          result = await voteService.getResultByType(type);
        }
      } else {
        throw new RestError(422, "Query param 'type' is required");
      }

      const message = 'Vote fetched successfully';
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

  route.get(
    '/self',
    middlewares.isAuth,
    middlewares.attachCurrentUser,
    middlewares.isUser,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await voteService.getVoteRecordByUser(req.user._id);

        const message = 'Vote fetched successfully';
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

  route.get(
    '/status',
    middlewares.isAuth,
    middlewares.attachCurrentUser,
    middlewares.isUser,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await voteService.getStatus(req.user._id);

        const message = 'Vote status fetched successfully';
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

  route.post(
    '/',
    middlewares.isAuth,
    middlewares.attachCurrentUser,
    middlewares.isUser,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const inputVoteDTO = { userId: req.user._id, ...req.body };

        const voteRecord: IVote = await voteService.create(inputVoteDTO as IVoteDTO);

        const message = 'Vote record is created';
        res.status(201).json({
          success: true,
          message,
          data: voteRecord,
        });
        logResponse(req, res, message);
      } catch (error) {
        next(error);
      }
    },
  );

  route.delete('/', middlewares.isAuth, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await voteService.deleteAll(req.query.candidateId);
      const message = `All vote record with candidateId ${req.query.candidateId} successfully deleted`;
      res.status(200).json({
        success: result,
        message,
      });

      logResponse(req, res, message);
    } catch (error) {
      next(error);
    }
  });
};

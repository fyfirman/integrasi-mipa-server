import { Container } from 'typedi';
import {
  Router, Request, Response, NextFunction,
} from 'express';
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
      const { type, candidateId } = req.query;

      const result = await voteService.get(type, candidateId);
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

  route.post('/', middlewares.isAuth, async (req: Request, res: Response, next: NextFunction) => {
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
  });
};

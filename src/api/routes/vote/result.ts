import { Container } from 'typedi';
import {
  Router, Request, Response, NextFunction,
} from 'express';
import { RestError } from '../../../helpers/error';
import { IVote, IVoteDTO } from '../../../interfaces/IVote';
import middlewares from '../../middlewares';
import logResponse from '../../../helpers/logResponse';
import VoteService from '../../../services/vote';

const router = Router({ mergeParams: true });

export default (voteRouter: Router): void => {
  voteRouter.use('/:type/result', router);

  const voteService: VoteService = Container.get(VoteService);

  router.get('/', middlewares.isAuth, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type } = req.params;
      const { candidateId, start, end } = req.query;

      let result;
      if (candidateId !== undefined) {
        result = await voteService.getResultByCandidate(candidateId);
      } else if (type === 'bem' || type === 'bpm' || type === 'hima') {
        if (start !== undefined && end !== undefined) {
          result = await voteService.getResultByType(
            type.toUpperCase(),
            new Date(start),
            new Date(end),
          );
        } else {
          result = await voteService.getResultByType(type.toUpperCase());
        }
      } else {
        throw new RestError(404, 'Not found');
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
};

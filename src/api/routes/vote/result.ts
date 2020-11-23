import { Container } from 'typedi';
import {
  Router, Request, Response, NextFunction,
} from 'express';
import moment from 'moment';
import { RestError } from '../../../helpers/error';
import { IVote, IVoteDTO } from '../../../interfaces/IVote';
import middlewares from '../../middlewares';
import logResponse from '../../../helpers/logResponse';
import VoteService from '../../../services/vote';
import voteTypeConstant from '../../../constant/voteTypeConstant';

const router = Router({ mergeParams: true });

export default (voteRouter: Router): void => {
  voteRouter.use('/:type/result', router);

  const voteService: VoteService = Container.get(VoteService);

  router.get('/', middlewares.isAuth, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const type = req.params.type.toUpperCase();
      const { major, batchYear, groupBy } = req.query;

      if (!Object.values(voteTypeConstant).includes(type)) {
        throw new RestError(404, 'Not found');
      }

      const date = req.query.date ? moment(req.query.date, 'YYYY-MM-DD').toDate() : null;
      const total = await voteService.getTotalResultByType(type, major, batchYear, date);
      let detail = await voteService.getResultGroupByCandidate(type, major, batchYear, date);

      if ((type === voteTypeConstant.BEM || type === voteTypeConstant.BPM) && groupBy === 'major') {
        detail = await voteService.getResultGroupByHima(type, batchYear, date);
      }

      const message = 'Vote fetched successfully';
      res.status(200).json({
        success: true,
        message,
        data: {
          ...total[0],
          detail,
        },
      });
      logResponse(req, res, message);
    } catch (error) {
      next(error);
    }
  });
};

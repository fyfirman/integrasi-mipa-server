import { Container } from 'typedi';
import {
  Router, Request, Response, NextFunction,
} from 'express';
import { IUser } from '../../../interfaces/IUser';
import { RestError } from '../../../helpers/error';
import { IVote, IVoteDTO } from '../../../interfaces/IVote';
import middlewares from '../../middlewares';
import logResponse from '../../../helpers/logResponse';
import VoteService from '../../../services/vote';

const router = Router({ mergeParams: true });

export default (voteRouter: Router): void => {
  voteRouter.use('/:type/status', router);

  const voteService: VoteService = Container.get(VoteService);

  router.get(
    '/',
    middlewares.isAuth,
    middlewares.attachCurrentUser,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const user: IUser = req.currentUser;
        const major = req.query.major ? req.query.major : user.major;

        const skip = parseInt(req.query.skip, 10);
        const limit = parseInt(req.query.limit, 10);
        const { type } = req.params;

        const result = await voteService.getListStatus(type.toUpperCase(), major, skip, limit);

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
};

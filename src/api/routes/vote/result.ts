import { Container } from 'typedi';
import {
  Router, Request, Response, NextFunction,
} from 'express';
import moment from 'moment';
import { RestError } from '../../../helpers/error';
import middlewares from '../../middlewares';
import logResponse from '../../../helpers/logResponse';
import VoteService from '../../../services/vote';
import voteTypeConstant from '../../../constant/voteTypeConstant';
import ExcelService from '../../../services/excel';
import downloadTypeConstant from '../../../constant/downloadTypeConstant';

const router = Router({ mergeParams: true });

export default (voteRouter: Router): void => {
  voteRouter.use('/:type/result', router);

  const voteService: VoteService = Container.get(VoteService);

  const excelService: ExcelService = Container.get(ExcelService);

  router.get(
    '/',
    middlewares.isAuth,
    middlewares.attachCurrentUser,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const type = req.params.type.toUpperCase();
        const { major, batchYear, groupBy } = req.query;

        if (!Object.values(voteTypeConstant).includes(type)) {
          throw new RestError(404, 'Not found');
        }

        if (groupBy !== undefined && !['major', 'batchYear'].includes(groupBy)) {
          throw new RestError(
            402,
            `Params groupBy '${groupBy}' is invalid. Please use 'major' or 'batchYear'`,
          );
        }

        const date = req.query.date ? moment(req.query.date, 'YYYY-MM-DD').toDate() : null;

        // Default. Group by candidate with filter major & batchYear
        let total = await voteService.getTotalResultByType(type, major, batchYear, date);
        let detail = await voteService.getResultGroupByCandidate(type, major, batchYear, date);

        if (
          (type === voteTypeConstant.BEM || type === voteTypeConstant.BPM)
          && groupBy === 'major'
        ) {
          total = await voteService.getTotalResultByType(type, undefined, batchYear, date);
          detail = await voteService.getResultGroupBy(groupBy, undefined, type, date);
        } else if (type === voteTypeConstant.HIMA && groupBy === 'batchYear') {
          const userMajor = req.currentUser.major;
          total = await voteService.getTotalResultByType(groupBy, userMajor, type, date);
          detail = await voteService.getResultGroupBy(groupBy, userMajor, type, date);
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
    },
  );

  router.get(
    '/new',
    middlewares.isAuth,
    middlewares.attachCurrentUser,
    // middlewares.isAdmin,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { type } = req.params;
        const groupBy: string[] = req.query.groupBy ? req.query.groupBy.split(',') : [];

        const data = await voteService.getResult(type.toUpperCase(), undefined, groupBy);

        const message = 'Vote fetched successfully';
        res.status(200).json({
          success: true,
          message,
          data,
        });
      } catch (error) {
        next(error);
      }
    },
  );

  router.get(
    '/download',
    middlewares.isAuth,
    middlewares.attachCurrentUser,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const voteType = req.params.type.toUpperCase();
        const { major, type } = req.query;
        let groupBy;
        let data;
        let workbook;
        switch (type.toUpperCase()) {
          case downloadTypeConstant.PASLON:
            groupBy = ['date', 'candidateId'];
            throw new RestError(404, 'Not available right now');
          case downloadTypeConstant.HIMPUNAN:
            groupBy = ['date', 'major'];
            throw new RestError(404, 'Not available right now');
          case downloadTypeConstant.ANGKATAN:
            groupBy = ['date', 'batchYear'];
            data = await voteService.getResult(voteType, major, groupBy);
            workbook = excelService.getBatchYearWorkbook(data);
            break;
          case downloadTypeConstant.TOTAL:
          default:
            groupBy = ['date'];
            data = await voteService.getResult(voteType, major, groupBy);
            workbook = excelService.getTotalWorkbook(data);
            break;
        }

        const filename = `${voteType}-${type || 'total'}-${Date.now()}.xlsx`;

        res.setHeader(
          'Content-Type',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        );

        res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

        return workbook.xlsx.write(res).then(() => {
          res.status(200).end();
        });
      } catch (error) {
        next(error);
      }
    },
  );
};

/* eslint-disable class-methods-use-this */
/* eslint-disable dot-notation */
import { Service, Inject } from 'typedi';
import moment from 'moment';
import { IUser } from '../interfaces/IUser';
import {
  IVoteStatus, IVoteTotalResult, IVoteDTO, IVote,
} from '../interfaces/IVote';

import { RestError } from '../helpers/error';
import voteTypeConstant from '../constant/voteTypeConstant';
import { candidateCollectionMap, majorConstant, purposeVerifConstant } from '../constant';
import { ICardVerification } from '../interfaces/ICardVerification';

@Service()
export default class VoteService {
  @Inject('voteModel') private voteModel;

  @Inject('userModel') private userModel;

  @Inject('cardVerificationModel') private cardVerificationModel;

  public async create(vote: IVoteDTO): Promise<IVote> {
    try {
      if (await this.hasVoted(vote.userId, vote.type)) {
        throw new RestError(400, `User has been voted on ${vote.type}`);
      }
      return this.voteModel.create(vote);
    } catch (error) {
      const statusCode = error.statusCode !== undefined ? error.statusCode : 500;
      throw new RestError(statusCode, error.message);
    }
  }

  public async getResultByCandidate(candidateId: IVote['candidateId']): Promise<IVote[]> {
    try {
      return this.voteModel.find({ candidateId });
    } catch (error) {
      throw new RestError(404, `An error occured ${error.message}`);
    }
  }

  public async getTotalResultByType(
    type: IVote['type'],
    major?: IVote['major'],
    batchYear?: IVote['batchYear'],
    date?: Date,
  ): Promise<IVoteTotalResult[]> {
    const createdAt = {
      $gte: moment(date).add(7, 'hours').toDate(),
      $lt: moment(date).add(7, 'hours').add(1, 'days').subtract(1, 'minute')
        .toDate(),
    };
    try {
      return this.voteModel.aggregate([
        {
          $match: {
            type,
            ...(major && { major }),
            ...(batchYear && { batchYear }),
            ...(date && { createdAt }),
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            totalUnverified: {
              $sum: { $cond: [{ $eq: ['$isVerified', false] }, 1, 0] },
            },
            totalVerified: {
              $sum: { $cond: [{ $eq: ['$isVerified', true] }, 1, 0] },
            },
          },
        },
      ]);
    } catch (error) {
      throw new RestError(500, error.message);
    }
  }

  public async getResultGroupByCandidate(
    type: IVote['type'],
    major?: IVote['major'],
    batchYear?: IVote['batchYear'],
    date?: Date,
  ): Promise<IVoteTotalResult[]> {
    const candidateCollection = candidateCollectionMap[type];
    const createdAt = {
      $gte: moment(date).toDate(),
      $lt: moment(date).add(1, 'days').subtract(1, 'minute').toDate(),
    };

    try {
      return await this.voteModel
        .aggregate([
          {
            $match: {
              type,
              ...(major && { major }),
              ...(batchYear && { batchYear }),
              ...(date && { createdAt }),
            },
          },
          {
            $group: {
              _id: '$candidateId',
              total: { $sum: 1 },
              totalUnverified: {
                $sum: { $cond: [{ $eq: ['$isVerified', false] }, 1, 0] },
              },
              totalVerified: {
                $sum: { $cond: [{ $eq: ['$isVerified', true] }, 1, 0] },
              },
            },
          },
          {
            $lookup: {
              from: candidateCollection,
              localField: '_id',
              foreignField: '_id',
              as: 'candidates',
            },
          },
          {
            $addFields: {
              candidateNumber: {
                $cond: [
                  { $ne: [{ $size: '$candidates' }, 0] },
                  { $arrayElemAt: ['$candidates.number', 0] },
                  0,
                ],
              },
              candidates: { $arrayElemAt: ['$candidates', 0] },
            },
          },
        ])
        .sort('candidateNumber');
    } catch (error) {
      throw new RestError(500, `An error occured ${error.message}`);
    }
  }

  public async getResult(
    type: IVote['type'],
    major: IVote['major'],
    groupBy: string[],
  ): Promise<any> {
    try {
      const grouping = this.parseGroupBy(groupBy);
      const isGroupByCandidate = groupBy.includes('candidateId');

      return await this.voteModel
        .aggregate([
          {
            $match: { type, ...(major && { major }) },
          },
          {
            $group: {
              _id: grouping,
              total: { $sum: 1 },
              totalUnverified: {
                $sum: { $cond: [{ $eq: ['$isVerified', false] }, 1, 0] },
              },
              totalVerified: {
                $sum: { $cond: [{ $eq: ['$isVerified', true] }, 1, 0] },
              },
            },
          },
          {
            $lookup: {
              from: candidateCollectionMap[type],
              localField: '_id.candidateId',
              foreignField: '_id',
              as: 'candidates',
            },
          },
          {
            $project: {
              ...(isGroupByCandidate && {
                candidateNumber: {
                  $cond: [
                    { $ne: [{ $size: '$candidates' }, 0] },
                    { $arrayElemAt: ['$candidates.number', 0] },
                    0,
                  ],
                },
                candidateName: {
                  $cond: [
                    { $ne: [{ $size: '$candidates' }, 0] },
                    { $arrayElemAt: ['$candidates.chairman.name', 0] },
                    'Kotak Kosong',
                  ],
                },
              }),
              totalUnverified: 1,
              totalVerified: 1,
              total: 1,
            },
          },
        ])
        .sort('_id.date');
    } catch (error) {
      throw new RestError(500, error.message);
    }
  }

  private parseGroupBy(array: string[]): any {
    const groupByObject = {};
    array.forEach((value) => {
      if (value === 'date') {
        Object.assign(groupByObject, {
          date: { $dateToString: { format: '%Y-%m-%d', date: '$updatedAt', timezone: '+07' } },
        });
      } else {
        Object.assign(groupByObject, { [value]: `$${value}` });
      }
    });
    return groupByObject;
  }

  public async getResultGroupBy(
    groupBy: string,
    major: IVote['major'],
    type: IVote['type'],
    date?: Date,
  ): Promise<IVoteTotalResult[]> {
    const createdAt = {
      $gte: moment(date).toDate(),
      $lt: moment(date).add(1, 'days').subtract(1, 'minute').toDate(),
    };

    try {
      return await this.voteModel
        .aggregate([
          {
            $match: {
              type,
              ...(major && { major }),
              ...(date && { createdAt }),
            },
          },
          {
            $group: {
              _id: `$${groupBy}`,
              total: { $sum: 1 },
              totalUnverified: {
                $sum: { $cond: [{ $eq: ['$isVerified', false] }, 1, 0] },
              },
              totalVerified: {
                $sum: { $cond: [{ $eq: ['$isVerified', true] }, 1, 0] },
              },
            },
          },
        ])
        .sort('major');
    } catch (error) {
      throw new RestError(500, `An error occured ${error.message}`);
    }
  }

  public async getVoteRecordByUser(userId: IVote['userId']): Promise<IVote[]> {
    try {
      return await this.voteModel.find({ userId });
    } catch (error) {
      throw new RestError(500, error.message);
    }
  }

  private async hasVoted(userId: IVoteDTO['userId'], type: IVoteDTO['type']): Promise<boolean> {
    try {
      const result = await this.voteModel.find({ userId, type });
      if (result.length === 0) {
        return false;
      }
      return true;
    } catch (error) {
      throw new RestError(500, error.message);
    }
  }

  public async getListStatus(
    type: IVote['type'],
    major: IUser['major'],
    skip = 0,
    limit = 10,
  ): Promise<any> {
    try {
      const result = await this.userModel
        .aggregate([
          {
            $match: {
              ...(major !== majorConstant.MIPA && { major }),
              ...(type === 'MIPA' && { mipaPermission: true }),
              ...(type === 'HIMA' && { himaPermission: true }),
            },
          },
          {
            $lookup: {
              from: 'votes',
              let: { id: '$_id' },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $eq: ['$$id', '$userId'],
                    },
                  },
                },
                {
                  $project: {
                    _id: 0,
                    type: 1,
                    isVerified: 1,
                    createdAt: 1,
                    updatedAt: 1,
                  },
                },
              ],
              as: 'votes',
            },
          },
          {
            $project: {
              npm: 1,
              name: 1,
              isVerified: 1,
              votes: 1,
            },
          },
        ])
        .sort('npm')
        .skip(skip)
        .limit(limit);

      return result.map((value) => {
        let hasVotedBPM = false;
        let hasVotedBEM = false;
        let hasVotedHIMA = false;
        value.votes.forEach((element) => {
          if (element.type === voteTypeConstant.BEM) hasVotedBEM = true;
          if (element.type === voteTypeConstant.BPM) hasVotedBPM = true;
          if (element.type === voteTypeConstant.HIMA) hasVotedHIMA = true;
        });

        return {
          ...value,
          ...(type === 'MIPA' && { hasVotedBEM }),
          ...(type === 'MIPA' && { hasVotedBPM }),
          ...(type === 'HIMA' && { hasVotedHIMA }),
        };
      });
    } catch (error) {
      throw new RestError(error.statusCode ? error.statusCode : 500, error.message);
    }
  }

  public async countListStatus(type: IVote['type'], major: IUser['major']): Promise<number> {
    try {
      return this.userModel.countDocuments({
        ...(major !== majorConstant.MIPA && { major }),
        ...(type === 'MIPA' && { mipaPermission: true }),
        ...(type === 'HIMA' && { himaPermission: true }),
      });
    } catch (error) {
      throw new RestError(error.statusCode ? error.statusCode : 500, error.message);
    }
  }

  public async getStatus(userId: ICardVerification['user']): Promise<any> {
    try {
      const hasVotedBEM = await this.hasVoted(userId, voteTypeConstant.BEM);
      const hasVotedBPM = await this.hasVoted(userId, voteTypeConstant.BPM);
      const hasVotedHIMA = await this.hasVoted(userId, voteTypeConstant.HIMA);

      const statusUploadBEM = await this.hasUpload(userId, purposeVerifConstant.VERIFY_BEM_VOTE);
      const statusUploadBPM = await this.hasUpload(userId, purposeVerifConstant.VERIFY_BPM_VOTE);
      const statusUploadHIMA = await this.hasUpload(userId, purposeVerifConstant.VERIFY_HIMA_VOTE);

      const resultBEM = await this.isVerified(userId, voteTypeConstant.BEM);
      const resultBPM = await this.isVerified(userId, voteTypeConstant.BPM);
      const resultHIMA = await this.isVerified(userId, voteTypeConstant.HIMA);

      return {
        bem: {
          hasVoted: hasVotedBEM,
          hasUpload: statusUploadBEM || resultBEM,
          isVerified: resultBEM,
        },
        bpm: {
          hasVoted: hasVotedBPM,
          hasUpload: statusUploadBPM || resultBPM,
          isVerified: resultBPM,
        },
        hima: {
          hasVoted: hasVotedHIMA,
          hasUpload: statusUploadHIMA || resultHIMA,
          isVerified: resultHIMA,
        },
      };
    } catch (error) {
      throw new RestError(500, error.message);
    }
  }

  private async isVerified(userId: IVote['userId'], type: IVote['type']): Promise<boolean> {
    try {
      const result = await this.voteModel.find({
        userId,
        type,
        isVerified: true,
      });
      if (result.length === 0) {
        return false;
      }
      return true;
    } catch (error) {
      throw new RestError(500, error.message);
    }
  }

  private async hasUpload(
    userId: ICardVerification['user'],
    purpose: ICardVerification['purpose'],
  ): Promise<boolean> {
    try {
      const result = await this.cardVerificationModel.find({
        user: userId,
        purpose,
        hasBeenVerified: false,
      });
      if (result.length === 0) {
        return false;
      }
      return true;
    } catch (error) {
      throw new RestError(500, error.message);
    }
  }

  public async deleteAll(candidateId: IVoteDTO['candidateId']): Promise<boolean> {
    try {
      const result = await this.voteModel.deleteMany({ candidateId });

      if (result.deletedCount === 0) {
        throw new RestError(400, 'Vote record not deleted');
      }
      return true;
    } catch (error) {
      throw new RestError(error.statusCode ? error.statusCode : 500, error.message);
    }
  }
}

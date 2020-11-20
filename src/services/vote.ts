import { Service, Inject } from 'typedi';
import {
  IVoteStatus, IVoteTotalResult, IVoteDTO, IVote,
} from '../interfaces/IVote';

import { RestError } from '../helpers/error';
import voteTypeConstant from '../constant/voteTypeConstant';
import { candidateCollectionMap } from '../constant';

@Service()
export default class VoteService {
  @Inject('voteModel') private voteModel;

  public async create(vote: IVoteDTO): Promise<IVote> {
    try {
      if (await this.isVoted(vote.userId, vote.type)) {
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

  // public async getTotalResultByType(
  //   type: IVote['type'],
  //   start?: Date,
  //   end?: Date,
  // ): Promise<IVoteTotalResult[]> {}

  public async getResultByType(
    type: IVote['type'],
    start?: Date,
    end?: Date,
  ): Promise<IVoteTotalResult[]> {
    const candidateCollection = candidateCollectionMap[type];
    let createdAt = {
      $gte: start !== undefined ? start : new Date(),
      $lt: end !== undefined ? end : new Date(),
    };

    if (start === undefined && end === undefined) {
      createdAt = {
        $gte: new Date(1970),
        $lt: new Date(),
      };
    }

    try {
      return await this.voteModel.aggregate([
        {
          $match: {
            type,
            createdAt,
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
            candidates: { $arrayElemAt: ['$candidates', 0] },
          },
        },
      ]);
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

  private async isVoted(userId: IVoteDTO['userId'], type: IVoteDTO['type']): Promise<boolean> {
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

  public async getStatus(userId: IVoteDTO['userId']): Promise<IVoteStatus> {
    try {
      const resultBEM = await this.isVoted(userId, voteTypeConstant.BEM);
      const resultBPM = await this.isVoted(userId, voteTypeConstant.BPM);
      const resultHIMA = await this.isVoted(userId, voteTypeConstant.HIMA);

      return {
        bem: resultBEM,
        bpm: resultBPM,
        hima: resultHIMA,
      };
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

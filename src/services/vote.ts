import { Service, Inject } from 'typedi';
import {
  IVoteTotalResult, IVoteDTO, IVote, IVoteResult,
} from '../interfaces/IVote';

import { RestError } from '../helpers/error';

@Service()
export default class VoteService {
  @Inject('voteModel') private voteModel;

  public async getResultByCandidate(candidateId: IVote['candidateId']): Promise<IVote[]> {
    try {
      return this.voteModel.find({ candidateId });
    } catch (error) {
      throw new RestError(404, `An error occured ${error.message}`);
    }
  }

  public async getResultByType(type: IVote['type']): Promise<IVoteTotalResult> {
    let filter = {};
    if (type !== undefined) {
      filter = { type };
    }
    try {
      return await this.voteModel.aggregate([
        { $match: filter },
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
      ]);
    } catch (error) {
      throw new RestError(500, `An error occured ${error.message}`);
    }
  }

  public async getAll(options = {}): Promise<any> {
    try {
      const total = await this.voteModel.countDocuments(options);
      const totalUnverifiedssss = await this.voteModel.countDocuments({
        isVerified: false,
        ...options,
      });
      const totalVerified = await this.voteModel.countDocuments({ isVerified: true, ...options });

      const voteResult = {
        total,
        totalUnverifiedssss,
        totalVerified,
      };

      return voteResult;
    } catch (error) {
      throw new RestError(404, `An error occured ${error.message}`);
    }
  }

  public async create(vote: IVoteDTO): Promise<IVote> {
    try {
      return this.voteModel.create(vote);
    } catch (error) {
      throw new RestError(500, `An error occured : : ${error.message}`);
    }
  }

  // public async delete(_id: string): Promise<boolean> {
  //   try {
  //     const result = await this.voteModel.deleteOne({ _id });
  //     if (result.deletedCount === 1) {
  //       return true;
  //     }
  //   } catch (error) {
  //     throw new RestError(400, error.message);
  //   }
  // }
}

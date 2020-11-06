import { Service, Inject } from 'typedi';
import { IVoteTotalResult, IVoteDTO, IVote } from '../interfaces/IVote';
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

  public async getResultByType(
    type: IVote['type'],
    start?: Date,
    end?: Date,
  ): Promise<IVoteTotalResult[]> {
    let candidateCollection = '';
    switch (type) {
      case 'BEM':
        candidateCollection = 'kabemcandidates';
        break;
      case 'BPM':
        candidateCollection = 'bpmcandidates';
        break;
      case 'HIMA':
        candidateCollection = 'kahimcandidates';
        break;
      default:
        break;
    }
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
      throw new RestError(500, `An error occured : ${error.message}`);
    }
  }

  public async create(vote: IVoteDTO): Promise<IVote> {
    try {
      if (await this.isVoted(vote.userId, vote.type)) {
        throw new RestError(400, `User has been voted on ${vote.type}`);
      }
      return this.voteModel.create(vote);
    } catch (error) {
      throw new RestError(500, `An error occured : ${error.message}`);
    }
  }

  public async isVoted(userId: IVoteDTO['userId'], type: IVoteDTO['type']): Promise<boolean> {
    try {
      const result = await this.voteModel.find({ userId, type });
      if (result.length === 0) {
        return false;
      }
      return true;
    } catch (error) {
      throw new RestError(500, `An error occured : ${error.message}`);
    }
  }
}

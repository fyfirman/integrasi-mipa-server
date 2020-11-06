import { Service, Inject } from 'typedi';
import {
  IVoteTotalResult, IVoteDTO, IVote, IVoteResult,
} from '../interfaces/IVote';
import { IKaHimCandidate } from '../interfaces/IKaHimCandidate';
import { IKaBEMcandidate } from '../interfaces/IKaBEMcandidate';
import { IBPMCandidate } from '../interfaces/IBPMCandidate';
import { RestError } from '../helpers/error';

@Service()
export default class VoteService {
  @Inject('voteModel') private voteModel;

  @Inject('kaBEMcandidateModel') private kaBEMcandidateModel;

  @Inject('BPMCandidateModel') private BPMCandidateModel;

  @Inject('kaHimCandidateModel') private kaHimCandidateModel;

  @Inject('logger') private logger;

  public async getResultByCandidate(candidateId: IVote['candidateId']): Promise<IVote[]> {
    try {
      return this.voteModel.find({ candidateId });
    } catch (error) {
      throw new RestError(404, `An error occured ${error.message}`);
    }
  }

  public async getResultByType(type: IVote['type']): Promise<IVoteTotalResult[]> {
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

    try {
      return await this.voteModel.aggregate([
        { $match: { type } },
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

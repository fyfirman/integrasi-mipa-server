import { Service, Inject } from 'typedi';
import { IVoteDTO, IVote } from '../interfaces/IVote';

import { RestError } from '../helpers/error';

@Service()
export default class VoteService {
  @Inject('voteModel') private voteModel;

  public async get(type: IVote['type'], candidateId: IVote['candidateId']): Promise<IVote[]> {
    try {
      return this.voteModel.get({ type, candidateId });
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

  public async delete(_id: string): Promise<boolean> {
    try {
      const result = await this.voteModel.deleteOne({ _id });
      if (result.deletedCount === 1) {
        return true;
      }
      return false;
    } catch (error) {
      throw new RestError(400, error.message);
    }
  }
}

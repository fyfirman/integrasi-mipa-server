/* eslint-disable dot-notation */
import { Service, Inject } from 'typedi';
import { IBPMCandidate, IBPMCandidateDTO } from '../interfaces/IBPMCandidate';
import { RestError } from '../helpers/error';

@Service()
export default class BPMCandidateService {
  @Inject('BPMCandidateModel') private BPMCandidateModel;

  @Inject('voteModel') private voteModel;

  public async getAll(skip = 0, limit = 0): Promise<IBPMCandidate[]> {
    try {
      return await this.BPMCandidateModel.find({}).skip(skip).limit(limit);
    } catch (error) {
      throw new RestError(404, `An error occured ${error.message}`);
    }
  }

  public async get(id: string): Promise<IBPMCandidate> {
    try {
      return await this.BPMCandidateModel.findById(id);
    } catch (error) {
      throw new RestError(404, `An error occured ${error.message}`);
    }
  }

  public async create(input: IBPMCandidateDTO): Promise<IBPMCandidate> {
    try {
      return this.BPMCandidateModel.create(input);
    } catch (error) {
      throw new RestError(400, error.message);
    }
  }

  public async edit(inputRecord: IBPMCandidate): Promise<IBPMCandidate> {
    try {
      const oldRecord = await this.get(inputRecord._id);

      const results = await this.BPMCandidateModel.updateOne(
        { _id: inputRecord._id },
        { $set: inputRecord },
      );

      if (results.ok === 0) {
        throw new RestError(404, 'Candidate record not found');
      }

      return { ...oldRecord['_doc'], ...inputRecord };
    } catch (error) {
      throw new RestError(error.statusCode ? error.statusCode : 400, error.message);
    }
  }

  public async delete(_id: string): Promise<boolean> {
    try {
      const candidateVote = await this.voteModel.find({ candidateId: _id });
      if (candidateVote.length !== 0) {
        throw new RestError(400, 'Candidate has vote record');
      }

      const result = await this.BPMCandidateModel.deleteOne({ _id });
      if (result.deletedCount === 1) {
        return true;
      }
      return false;
    } catch (error) {
      throw new RestError(400, error.message);
    }
  }
}

import _ from 'lodash';
import { Service, Inject } from 'typedi';
import { IKaBEMcandidateDTO, IKaBEMcandidate } from '../interfaces/IKaBEMcandidate';
import { RestError } from '../helpers/error';

@Service()
export default class KaBEMcandidateService {
  @Inject('kaBEMcandidateModel') private kaBEMcandidateModel;

  @Inject('voteModel') private voteModel;

  public async getAll(skip = 0, limit = 0): Promise<IKaBEMcandidate[]> {
    try {
      return await this.kaBEMcandidateModel.find({}).skip(skip).limit(limit).sort('number');
    } catch (error) {
      throw new RestError(404, `An error occured ${error.message}`);
    }
  }

  public async get(id: string): Promise<IKaBEMcandidate> {
    try {
      return await this.kaBEMcandidateModel.findById(id);
    } catch (error) {
      throw new RestError(404, `An error occured ${error.message}`);
    }
  }

  public async create(input: IKaBEMcandidateDTO): Promise<IKaBEMcandidate> {
    try {
      return this.kaBEMcandidateModel.create(input);
    } catch (error) {
      throw new RestError(400, error.message);
    }
  }

  public async edit(inputRecord: IKaBEMcandidate): Promise<IKaBEMcandidate> {
    try {
      const oldRecord: IKaBEMcandidate = await this.get(inputRecord._id);
      const newRecord = _.merge(oldRecord, inputRecord);

      // Replacing null mission
      if (inputRecord.mission) {
        oldRecord.mission.forEach((value, index) => {
          if (inputRecord.mission[index]) {
            newRecord.mission[index] = inputRecord.mission[index];
          } else {
            newRecord.mission[index] = value;
          }
        });
      }

      const results = await this.kaBEMcandidateModel.updateOne(
        { _id: inputRecord._id },
        { $set: newRecord },
      );

      if (results.ok === 0) {
        throw new RestError(404, 'Candidate record not found');
      }

      return newRecord;
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

      const result = await this.kaBEMcandidateModel.deleteOne({ _id });
      if (result.deletedCount === 1) {
        return true;
      }
      return false;
    } catch (error) {
      throw new RestError(400, error.message);
    }
  }
}

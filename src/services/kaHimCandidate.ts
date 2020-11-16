import _ from 'lodash';
import { Service, Inject } from 'typedi';
import { IKaBEMcandidateDTO } from '../interfaces/IKaBEMcandidate';
import { IKaHimCandidateDTO, IKaHimCandidate } from '../interfaces/IKaHimCandidate';
import { RestError } from '../helpers/error';

@Service()
export default class KaHimCandidateService {
  @Inject('kaHimCandidateModel') private kaHimCandidateModel;

  public async getAll(skip = 0, limit = 0, major = null): Promise<IKaHimCandidate[]> {
    try {
      if (major === null) {
        return await this.kaHimCandidateModel.find({}).skip(skip).limit(limit).sort('major');
      }
      return await this.kaHimCandidateModel.find({ major }).skip(skip).limit(limit).sort('number');
    } catch (error) {
      throw new RestError(404, `An error occured ${error.message}`);
    }
  }

  public async get(id: string): Promise<IKaHimCandidate> {
    try {
      return await this.kaHimCandidateModel.findById(id);
    } catch (error) {
      throw new RestError(404, `An error occured ${error.message}`);
    }
  }

  public async create(input: IKaHimCandidateDTO): Promise<IKaHimCandidate> {
    try {
      const modifiedInput = {
        ...input,
        hasViceChairman: input.viceChairman !== undefined,
      };

      return this.kaHimCandidateModel.create(modifiedInput);
    } catch (error) {
      throw new RestError(400, error.message);
    }
  }

  public async edit(inputRecord: IKaHimCandidate): Promise<IKaHimCandidate> {
    try {
      const oldRecord: IKaHimCandidate = await this.get(inputRecord._id);
      if (oldRecord === null) {
        throw new RestError(404, `User with id ${inputRecord._id} not found`);
      }

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

      const results = await this.kaHimCandidateModel.updateOne(
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
      const result = await this.kaHimCandidateModel.deleteOne({ _id });
      if (result.deletedCount === 1) {
        return true;
      }
      return false;
    } catch (error) {
      throw new RestError(400, error.message);
    }
  }
}

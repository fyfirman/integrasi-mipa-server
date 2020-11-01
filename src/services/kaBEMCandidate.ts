import { Service, Inject } from 'typedi';
import { IKaBEMcandidateDTO, IKaBEMcandidate } from '../interfaces/IKaBEMcandidate';
import { RestError } from '../helpers/error';

@Service()
export default class KaBEMcandidateService {
  @Inject('kaBEMcandidateModel') private kaBEMcandidateModel;

  public async getAll(skip = 0, limit = 0): Promise<{ users: IKaBEMcandidate }> {
    try {
      const userRecords = await this.kaBEMcandidateModel.find({}).skip(skip).limit(limit);
      return userRecords;
    } catch (error) {
      throw new RestError(404, `An error occured ${error.message}`);
    }
  }

  public async get(id: string): Promise<{ user: IKaBEMcandidate }> {
    try {
      const userRecord = await this.kaBEMcandidateModel.findById(id);
      return userRecord;
    } catch (error) {
      throw new RestError(404, `An error occured ${error.message}`);
    }
  }

  public async create(input: IKaBEMcandidateDTO): Promise<{ kaBEMCandidate: IKaBEMcandidate }> {
    try {
      return this.kaBEMcandidateModel.create(input);
    } catch (error) {
      throw new RestError(400, error.message);
    }
  }
}

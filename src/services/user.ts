import { Service, Inject } from 'typedi';
import { IUser } from '../interfaces/IUser';
import { RestError } from '../helpers/error';

@Service()
export default class UserService {
  @Inject('userModel') private userModel;

  public async getAll(skip = 0, limit = 0): Promise<{ users: IUser }> {
    try {
      const userRecords = await this.userModel.find({}).skip(skip).limit(limit);
      return userRecords;
    } catch (error) {
      throw new RestError(404, `An error occured ${error.message}`);
    }
  }

  public async get(id: string): Promise<{ users: IUser }> {
    try {
      const userRecord = await this.userModel.findById(id);
      return userRecord;
    } catch (error) {
      throw new RestError(404, `An error occured ${error.message}`);
    }
  }
}

import { Service, Inject } from 'typedi';
import { randomBytes } from 'crypto';
import argon2 from 'argon2';
import { IUser, changePasswordUserDTO } from '../interfaces/IUser';
import { RestError } from '../helpers/error';

@Service()
export default class UserService {
  @Inject('logger') private logger;

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

  public async changePassword(user: changePasswordUserDTO): Promise<{ user: IUser }> {
    try {
      const salt = randomBytes(32);

      this.logger.silly('Hashing password');
      const hashedPassword = await argon2.hash(user.newPassword, { salt });
      const newRecord = {
        ...user,
        salt: salt.toString('hex'),
        password: hashedPassword,
        isPasswordChanged: true,
      };

      const userRecord = await this.userModel.findByIdAndUpdate(user.id, newRecord, { new: true });
      return userRecord;
    } catch (error) {
      this.logger.error(error);
      throw new RestError(404, `An error occured ${error.message}`);
    }
  }
}

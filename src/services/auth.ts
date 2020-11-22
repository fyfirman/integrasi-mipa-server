/* eslint-disable class-methods-use-this */
import { Service, Inject } from 'typedi';
import argon2 from 'argon2';
import { randomBytes } from 'crypto';
import jwt from 'jsonwebtoken';
import { RestError } from '../helpers/error';
import { IUser, IUserInputDTO, changePasswordUserDTO } from '../interfaces/IUser';
import config from '../config';
import { majorConstant } from '../constant';
import { getBatchYearByNPM } from '../helpers/getBatchYear';
import majorNPM from '../constant/majorNPM';

@Service()
export default class AuthService {
  @Inject('logger') private logger;

  @Inject('userModel') private userModel;

  public async SignUp(userInputDTO: IUserInputDTO): Promise<{ user: IUser }> {
    try {
      const salt = randomBytes(32);

      this.logger.silly('Hashing password');
      const hashedPassword = await argon2.hash(userInputDTO.npm, { salt });
      this.logger.silly('Creating user db record');

      const userRecord = await this.userModel.create({
        ...userInputDTO,
        major: majorNPM[userInputDTO.npm.substring(2, 6)],
        batchYear: getBatchYearByNPM(userInputDTO.npm),
        salt: salt.toString('hex'),
        password: hashedPassword,
      });

      const user = userRecord.toObject();
      Reflect.deleteProperty(user, 'password');
      Reflect.deleteProperty(user, 'salt');

      return { user };
    } catch (error) {
      throw new RestError(500, `An error occured : ${error.message}`);
    }
  }

  public async SignIn(npm: string, password: string): Promise<{ user: IUser; token: string }> {
    const userRecord = await this.userModel.findOne({ npm });
    if (!userRecord) {
      throw new RestError(404, 'User not found');
    }

    this.logger.silly('Checking password');
    const validPassword = await argon2.verify(userRecord.password, password);
    if (validPassword) {
      this.logger.silly('Password is valid!');
      this.logger.silly('Generating JWT');
      const token = this.generateToken(userRecord);

      const user = userRecord.toObject();
      Reflect.deleteProperty(user, 'password');
      Reflect.deleteProperty(user, 'salt');

      return { user, token };
    }
    throw new RestError(401, 'Invalid Password');
  }

  public async checkRegistered(npm: string): Promise<boolean> {
    const userRecord = await this.userModel.findOne({ npm });
    if (userRecord) {
      return true;
    }
    return false;
  }

  private generateToken(user) {
    const duration = 60;

    const today = new Date();
    const expired = new Date(today);
    expired.setDate(today.getDate() + duration);

    this.logger.silly(`Sign JWT for userId: ${user._id}`);

    return jwt.sign(
      {
        _id: user._id,
        role: user.role,
        name: user.name,
        exp: expired.getTime() / 1000,
      },
      config.jwtSecret,
    );
  }

  public async changePassword(user: changePasswordUserDTO): Promise<{ user: IUser }> {
    try {
      const userRecord = await this.userModel.findOne({ _id: user.id });
      if (!userRecord) {
        throw new RestError(404, 'User not found');
      }

      this.logger.silly('Checking password');
      const validPassword = await argon2.verify(userRecord.password, user.oldPassword);

      if (validPassword) {
        const salt = randomBytes(32);

        this.logger.silly('Hashing password');
        const hashedPassword = await argon2.hash(user.newPassword, { salt });
        const newRecord = {
          ...user,
          salt: salt.toString('hex'),
          password: hashedPassword,
          isPasswordChanged: true,
        };

        const newUserRecord = await this.userModel.findByIdAndUpdate(user.id, newRecord, {
          new: true,
        });
        return newUserRecord;
      }
      throw new RestError(403, 'Wrong old password');
    } catch (error) {
      this.logger.error(error);
      throw new RestError(
        error.statusCode ? error.statusCode : 404,
        `An error occured : ${error.message}`,
      );
    }
  }
}

/* eslint-disable class-methods-use-this */
import argon2 from 'argon2';
import { Service, Inject } from 'typedi';
import { randomBytes } from 'crypto';
import { IDumpPasswordDTO } from '../interfaces/IDumpPassword';
import { IVote } from '../interfaces/IVote';
import { ICardVerificationInputDTO, ICardVerification } from '../interfaces/ICardVerification';

import { RestError } from '../helpers/error';
import { purposeVerifConstant, purposeToVoteConstant } from '../constant';

@Service()
export default class CardVerificationService {
  @Inject('cardVerificationModel') private cardVerificationModel;

  @Inject('userModel') private userModel;

  @Inject('voteModel') private voteModel;

  @Inject('dumpPasswordModel') private dumpPasswordModel;

  public async getAll(
    skip = 0,
    limit = 0,
    purpose = null,
    major = null,
    isAccepted = null,
    hasBeenVerified = null,
  ): Promise<ICardVerification[]> {
    try {
      const options = {};

      if (purpose) Object.assign(options, { purpose });
      if (isAccepted) Object.assign(options, { isAccepted });
      if (hasBeenVerified) Object.assign(options, { hasBeenVerified });
      if (major) Object.assign(options, { major });

      return this.cardVerificationModel
        .find(options)
        .populate('user', 'npm name')
        .skip(skip)
        .limit(limit);
    } catch (error) {
      throw new RestError(404, 'ID card verification not found');
    }
  }

  public async get(id: string): Promise<ICardVerification> {
    try {
      const verificationRecord = await this.cardVerificationModel
        .findById(id)
        .populate('user', 'npm name');
      return verificationRecord;
    } catch (error) {
      throw new RestError(404, 'ID card verification not found');
    }
  }

  public async getByUser(user: ICardVerification['user']): Promise<ICardVerification[]> {
    try {
      const verificationRecord = await this.cardVerificationModel.find({ user });
      return verificationRecord;
    } catch (error) {
      throw new RestError(404, 'ID card verification not found');
    }
  }

  public async create(
    record: ICardVerificationInputDTO,
    oldPassword: IDumpPasswordDTO['password'],
    newPassword: IDumpPasswordDTO['password'],
  ): Promise<{ idCardVerification: ICardVerification }> {
    try {
      const userRecord = await this.userModel.findOne({ _id: record.user });
      if (!userRecord) {
        throw new RestError(404, 'User not found');
      }
      const validPassword = await argon2.verify(userRecord.password, oldPassword);

      if (validPassword) {
        return this.cardVerificationModel.create(record).then(async (res) => {
          if (res.purpose === purposeVerifConstant.ACTIVATE_ACCOUNT) {
            const result = await this.userModel.updateOne(
              { _id: res.user },
              { $set: { hasUpload: true } },
            );
            if (result.nModified === 0) {
              const user = await this.userModel.findOne({ _id: res.user });
              if (user.hasUpload) {
                throw new RestError(
                  400,
                  'User has uploaded an verification. Please accept/decline an verification',
                );
              }
              throw new RestError(500, 'Cannot update hasUpload on user model');
            }

            this.dumpPassword(res._id, newPassword);
          }
        });
      }
      throw new RestError(400, 'Invalid old password');
    } catch (error) {
      throw new RestError(400, error.message);
    }
  }

  private async dumpPassword(cardVerificationId: string, password): Promise<void> {
    try {
      const hashedPassword = await this.generateHashedPassword(password);
      const dump: IDumpPasswordDTO = {
        cardVerificationId,
        password: hashedPassword.password,
        salt: hashedPassword.salt,
      };

      const dumpResult = await this.dumpPasswordModel.create(dump);
      if (dumpResult.nCreated === 0) {
        throw new RestError(500, 'Cannot dump password');
      }
    } catch (error) {
      throw new RestError(500, error.message);
    }
  }

  private async generateHashedPassword(
    string: string,
  ): Promise<{ password: string; salt: string }> {
    try {
      const salt = randomBytes(32);
      const password = await argon2.hash(string, { salt });

      return {
        salt: salt.toString('hex'),
        password,
      };
    } catch (error) {
      throw new RestError(500, error.message);
    }
  }

  public async verify(
    _id: string,
    isAccepted: boolean,
  ): Promise<{ idCardVerification: ICardVerification }> {
    try {
      const results = await this.cardVerificationModel.updateOne(
        { _id },
        { $set: { isAccepted, hasBeenVerified: true, verifiedAt: Date.now() } },
      );

      this.cardVerificationModel.findOne({ _id }).then(async (res: ICardVerification) => {
        if (res.purpose === purposeVerifConstant.ACTIVATE_ACCOUNT) {
          this.verifyAccount(res.user, isAccepted);
        } else {
          this.verifyVote(res.user, purposeToVoteConstant[res.purpose], isAccepted);
        }
      });

      if (results.nModified === 0) {
        throw new RestError(404, 'Card verification record not found');
      }

      return results;
    } catch (error) {
      throw new RestError(400, error.message);
    }
  }

  private async verifyAccount(
    userId: ICardVerification['user'],
    isAccepted: boolean,
  ): Promise<void> {
    let updateData = {};
    if (isAccepted) {
      updateData = { isVerified: true };
    } else {
      updateData = { hasUpload: false };
    }
    const result = await this.userModel.updateOne({ _id: userId }, { $set: updateData });

    if (result.nModified === 0) {
      throw new RestError(400, 'Cannot update isVerified on user model');
    }
  }

  private async verifyVote(
    userId: ICardVerification['user'],
    voteType: IVote['type'],
    isAccepted: boolean,
  ): Promise<void> {
    const result = await this.voteModel.updateOne(
      { userId, type: voteType },
      { $set: { isVerified: isAccepted } },
    );

    if (result.nModified === 0) {
      throw new RestError(400, 'Cannot update vote record');
    }
  }

  public async delete(user: string): Promise<boolean> {
    try {
      const result = await this.cardVerificationModel.deleteOne({ user });
      if (result.deletedCount === 1) {
        return true;
      }
      return false;
    } catch (error) {
      throw new RestError(400, error.message);
    }
  }
}

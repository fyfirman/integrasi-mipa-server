import { Service, Inject } from 'typedi';
import { ICardVerificationInputDTO, ICardVerification } from '../interfaces/ICardVerification';

import { RestError } from '../helpers/error';
import { purposeVerifConstant } from '../constant';

@Service()
export default class CardVerificationService {
  @Inject('cardVerificationModel') private cardVerificationModel;

  @Inject('userModel') private userModel;

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
      if (purpose === purposeVerifConstant.VERIFY_HIMA_VOTE && major) {
        Object.assign(options, { hasBeenVerified });
      }

      return this.cardVerificationModel.find(options).populate('user').skip(skip).limit(limit);
    } catch (error) {
      throw new RestError(404, 'ID card verification not found');
    }
  }

  public async get(id: string): Promise<ICardVerification> {
    try {
      const verificationRecord = await this.cardVerificationModel.findById(id);
      return verificationRecord;
    } catch (error) {
      throw new RestError(404, 'ID card verification not found');
    }
  }

  public async create(
    record: ICardVerificationInputDTO,
  ): Promise<{ idCardVerification: ICardVerification }> {
    try {
      return this.cardVerificationModel.create(record).then(async (res) => {
        console.log(`Created record with id ${res._id}`);
        if (res.purpose === 'ACTIVATE_ACCOUNT') {
          const result = await this.userModel.updateOne(
            { _id: res.user },
            { $set: { hasUpload: true } },
          );

          if (result.nModified === 0) {
            throw new RestError(400, 'Cannot update hasUpload on user model');
          }
        }
      });
    } catch (error) {
      throw new RestError(400, error.message);
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

      this.cardVerificationModel.findOne({ _id, purpose: 'ACTIVATE_ACCOUNT' }).then(async (res) => {
        let updateData = {};
        if (isAccepted) {
          updateData = { isVerified: true };
        } else {
          updateData = { hasUpload: false };
        }
        const updateUser = await this.userModel.updateOne({ _id: res.user }, { $set: updateData });

        if (updateUser.nModified === 0) {
          throw new RestError(400, 'Cannot update isVerified on user model');
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

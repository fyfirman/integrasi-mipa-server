import { Service, Inject } from 'typedi';
import { ICardVerificationInputDTO, ICardVerification } from '../interfaces/ICardVerification';

import { RestError } from '../helpers/error';
import { purposeVerifConstant } from '../constant';

@Service()
export default class CardVerificationService {
  @Inject('cardVerificationModel') private cardVerificationModel;

  @Inject('userModel') private userModel;

  @Inject('logger') private logger;

  public async getAll(
    skip = 0,
    limit = 0,
    purpose = null,
    major = null,
  ): Promise<{ cardVerifications: ICardVerification }> {
    try {
      if (purpose === purposeVerifConstant.VERIFY_HIMA_VOTE) {
        return this.cardVerificationModel.find({ purpose, major }).skip(skip).limit(limit);
      }
      return this.cardVerificationModel
        .find(purpose ? { purpose } : {})
        .skip(skip)
        .limit(limit);
    } catch (error) {
      throw new RestError(404, 'ID card verification not found');
    }
  }

  public async get(id: string): Promise<{ idCardVerification: ICardVerification }> {
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
      const verificationRecord = await this.cardVerificationModel.create(record);
      return verificationRecord;
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

      this.cardVerificationModel.findOne({ _id, purpose: 'ACTIVATE_ACCOUNT' }).then((res) => {
        this.userModel.updateOne({ _id: res.userId }, { $set: { isVerified: isAccepted } });
      });

      if (results.nModified === 0) {
        throw new RestError(404, 'Card verification record not found');
      }

      return results;
    } catch (error) {
      throw new RestError(400, error.message);
    }
  }

  public async delete(userId: string): Promise<boolean> {
    try {
      const result = await this.cardVerificationModel.deleteOne({ userId });
      if (result.deletedCount === 1) {
        return true;
      }
      return false;
    } catch (error) {
      throw new RestError(400, error.message);
    }
  }
}

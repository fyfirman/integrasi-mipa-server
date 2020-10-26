import { Service, Inject } from 'typedi';
import { ICardVerificationInputDTO, ICardVerification } from '../interfaces/ICardVerification';

import { RestError } from '../helpers/error';

@Service()
export default class CardVerificationService {
  @Inject('cardVerificationModel') private cardVerificationModel;

  public async getAll(skip = 0, limit = 0): Promise<{ cardVerifications: ICardVerification }> {
    try {
      const verificationRecords = await this.cardVerificationModel.find({}).skip(skip).limit(limit);
      return verificationRecords;
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
    result: boolean,
  ): Promise<{ idCardVerification: ICardVerification }> {
    try {
      const results = await this.cardVerificationModel.updateOne(
        { _id },
        { $set: { result, hasBeenVerified: true } },
      );

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

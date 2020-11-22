import { Service, Inject } from 'typedi';
import { IVote } from '../interfaces/IVote';
import { ICardVerificationInputDTO, ICardVerification } from '../interfaces/ICardVerification';

import { RestError } from '../helpers/error';
import { purposeVerifConstant, purposeToVoteConstant } from '../constant';

@Service()
export default class CardVerificationService {
  @Inject('cardVerificationModel') private cardVerificationModel;

  @Inject('userModel') private userModel;

  @Inject('voteModel') private voteModel;

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
      const verificationRecord = await this.cardVerificationModel
        .find({ user });
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

import { IUser } from './IUser';

export interface ICardVerification {
  _id: string;
  user: IUser['_id'];
  selfiePhotoPath: string;
  hasBeenVerified: boolean;
  isAccepted: boolean;
  purpose: string;
  major: string;
  verifiedAt: Date;
}

export interface ICardVerificationInputDTO {
  user: IUser['_id'];
  selfiePhotoPath: string;
  purpose: string;
  major: string;
}

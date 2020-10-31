import { IUser } from './IUser';

export interface ICardVerification {
  _id: string;
  userId: IUser['_id'];
  selfiePhotoPath: string;
  hasBeenVerified: boolean;
  isAccepted: boolean;
  purpose: string;
  major: string;
  verifiedAt: Date;
}

export interface ICardVerificationInputDTO {
  userId: IUser['_id'];
  selfiePhotoPath: File;
  purpose: string;
  major: string;
}

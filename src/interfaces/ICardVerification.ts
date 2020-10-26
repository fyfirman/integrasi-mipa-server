import { IUser } from './IUser';

export interface ICardVerification {
  _id: string;
  userId: IUser['_id'];
  selfiePhotoPath: string;
  status: boolean;
}

export interface ICardVerificationInputDTO {
  userId: IUser['_id'];
  selfiePhotoPath: File;
}

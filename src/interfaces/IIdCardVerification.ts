import { IUser } from './IUser';

export interface IIdCardVerification {
  _id: string;
  userId: IUser['_id'];
  selfiePhotoPath: string;
  status: boolean;
}

export interface IIdCardVerificationInputDTO {
  userId: string;
  selfiePhoto: File;
}

import { IUser } from './IUser';

export interface IConfiguration {
  _id: string;
  configName: string;
  isActive: boolean;
}

export interface ICardVerificationInputDTO {
  userId: IUser['_id'];
  selfiePhotoPath: File;
  purpose: string;
  major: string;
}

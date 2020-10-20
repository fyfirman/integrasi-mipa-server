export interface IUser {
  _id: string;
  npm: string;
  password: string;
  salt: string;
  name: string;
  major: string;
}

export interface IUserInputDTO {
  npm: string;
  password: string;
  name: string;
  major: string;
}

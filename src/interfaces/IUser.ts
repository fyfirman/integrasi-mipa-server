export interface IUser {
  _id: string;
  npm: string;
  password: string;
  name: string;
  major: string;
  role: string;
  isPasswordChanged: boolean;
  isVerified: boolean;
  himaPermission: boolean;
  mipaPermission: boolean;
}

export interface IUserInputDTO {
  npm: string;
  name: string;
  himaPermission: boolean;
  mipaPermission: boolean;
}

export interface IUserSeederDTO {
  npm: string;
  password: string;
  name: string;
  major: string;
  role: string;
  himaPermission: boolean;
  mipaPermission: boolean;
  salt: string;
  isPasswordChanged: boolean;
  isVerified: boolean;
}

export interface changePasswordUserDTO {
  id: string;
  oldPassword: string;
  newPassword: string;
}

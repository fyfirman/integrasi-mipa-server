export interface IDumpPassword {
  _id: string;
  user: string;
  password: string;
  salt: string;
}

export interface IDumpPasswordDTO {
  user: string;
  password: string;
  salt: string;
}

export interface IDumpPassword {
  _id: string;
  cardVerificationId: string;
  password: string;
  salt: string;
}

export interface IDumpPasswordDTO {
  cardVerificationId: string;
  password: string;
  salt: string;
}

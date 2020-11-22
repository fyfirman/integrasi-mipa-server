import { IUser } from '../interfaces/IUser';

export const getBatchYearByNPM = (npm: IUser['npm']): string => {
  const year = npm.substring(6, 8);
  return `20${year}`;
};

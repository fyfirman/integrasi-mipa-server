import path from 'path';

export const removeDirName = (url: string): string => url.replace(path.join(__dirname, '../..'), '');

export const addBaseURL = (url: string): string => {
  const regex = new RegExp('\\\\', 'g');
  return process.env.BASE_URI + url.replace(regex, '/');
};

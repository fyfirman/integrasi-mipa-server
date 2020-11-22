/* eslint-disable no-console */
import * as fs from 'fs';
import * as path from 'path';
import neatCsv from 'neat-csv';
import seeder from 'mongoose-seed';
import argon2 from 'argon2';
import { randomBytes } from 'crypto';

import { IUserSeederDTO, IUserInputDTO } from '../interfaces/IUser';
import StringHelper from '../helpers/StringHelper';
import config from '../config';
import majorNPM from '../constant/majorNPM';
import roleConstant from '../constant/roleConstant';
import { majorConstant } from '../constant';

const formatData = (row): IUserInputDTO => ({
  npm: row.NPM,
  name: StringHelper.toTitleCase(row.Nama),
  himaPermission: row.HMP === 'v',
  mipaPermission: row.MIPA === 'v',
  password: row.Password ? row.Password : '',
});

const readCSV = (filename: string, cb: (userData: IUserInputDTO[]) => void): void => {
  fs.readFile(path.resolve(__dirname, '../../csv', filename), async (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    const result = await neatCsv(data);
    const userData: IUserInputDTO[] = result.map((row) => formatData(row));
    cb(userData);
  });
};

const generatePassword = async (password: string): Promise<{ salt: string; password: string }> => {
  const salt = randomBytes(32);
  const hashedPassword = await argon2.hash(password, { salt });

  return {
    salt: salt.toString('hex'),
    password: hashedPassword,
  };
};

const fillAttribute = async (user: IUserInputDTO, isAdmin = false): Promise<IUserSeederDTO> => {
  const getRole = (major) => {
    if (isAdmin) {
      return major === majorConstant.MIPA ? roleConstant.ADMIN_MIPA : roleConstant.ADMIN;
    }
    return roleConstant.USER;
  };

  if (isAdmin) console.log(user.password);

  const major = majorNPM[user.npm.substring(2, 4)];
  const role = getRole(major);
  const { salt, password } = await generatePassword(isAdmin ? user.password : user.npm);

  const result: IUserSeederDTO = {
    ...user,
    major,
    role,
    salt,
    password,
    isPasswordChanged: isAdmin,
    isVerified: isAdmin,
  };
  return result;
};

const seed = (): void => {
  seeder.connect(config.databaseUrl, () => {
    seeder.loadModels(['./src/models/user']);
    seeder.setLogOutput(false);

    seeder.clearModels(['User'], () => {
      const callback = (users: IUserInputDTO[], isAdmin = false): void => {
        Promise.all(users.map((user) => fillAttribute(user, isAdmin))).then((res) => {
          console.log(
            `Read ${res.length} ${
              res[0].major === majorConstant.MIPA ? 'ADMIN' : res[0].major
            } data`,
          );
          const seederData = [{ model: 'User', documents: res }];

          seeder.populateModels(seederData, () => {
            console.log(
              `${res[0].major === majorConstant.MIPA ? 'ADMIN' : res[0].major} successfully seeded`,
            );
          });
        });
      };

      readCSV('hifi.csv', callback);
      readCSV('himaka.csv', callback);
      readCSV('himaktu.csv', callback);
      readCSV('himasta.csv', callback);
      readCSV('himatif.csv', callback);
      readCSV('himatika.csv', callback);
      readCSV('himbio.csv', callback);
      readCSV('hmte.csv', callback);
      readCSV('pedra.csv', callback);
      readCSV('test.csv', callback);
      readCSV('admin.csv', (data) => callback(data, true));
    });
  });
};

export default seed;

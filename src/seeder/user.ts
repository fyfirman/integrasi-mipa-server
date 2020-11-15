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

const formatData = (row): IUserInputDTO => ({
  npm: row.NPM,
  name: StringHelper.toTitleCase(row.Nama),
  himaPermission: row.HMP === 'v',
  mipaPermission: row.MIPA === 'v',
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

const fillAttribute = async (user: IUserInputDTO): Promise<IUserSeederDTO> => {
  const major = majorNPM[user.npm.substring(2, 4)];
  const role = roleConstant.USER;
  const { salt, password } = await generatePassword(user.npm);

  const result: IUserSeederDTO = {
    ...user,
    major,
    role,
    salt,
    password,
  };
  return result;
};

const seed = (): void => {
  seeder.connect(config.databaseUrl, () => {
    seeder.loadModels(['./src/models/user']);
    seeder.setLogOutput(false);

    seeder.clearModels(['User'], () => {
      const callback = (users: IUserInputDTO[]): void => {
        const seedData = (data: IUserSeederDTO[]) => {
          const seederData = [{ model: 'User', documents: data }];

          seeder.populateModels(seederData, () => {
            console.log(`${data[0].major} successfully seeded`);
          });
        };

        Promise.all(users.map((user) => fillAttribute(user))).then((res) => {
          seedData(res);

          console.log(`Read ${res.length} ${res[0].major} data`);
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
    });
  });
};

export default seed;

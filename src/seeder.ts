import seeder from 'mongoose-seed';
import config from './config';
import configSeeder from './seeder/configuration';
import userSeeder from './seeder/user';

seeder.connect(config.databaseUrl, () => {
  seeder.loadModels(['./src/models/configuration']);

  seeder.clearModels(['Configuration'], () => {
    const seederData = [configSeeder];

    seeder.populateModels(seederData, () => {
      seeder.disconnect();
    });
  });
});

userSeeder();

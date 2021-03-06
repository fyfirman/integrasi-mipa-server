import 'reflect-metadata';

import express from 'express';
import path from 'path';
import config from './config';
import loaders from './loaders';
import Logger from './loaders/logger';

const startServer = async () => {
  const app = express();

  app.use('/public', express.static(path.join(__dirname, '../public')));

  await loaders({ expressApp: app });

  app.listen(config.port, (err) => {
    if (err) {
      Logger.error(err);
      process.exit(1);
    }
    Logger.info(`Server listening on port: ${config.port} with ${config.mode} mode`);
  });
};

startServer();

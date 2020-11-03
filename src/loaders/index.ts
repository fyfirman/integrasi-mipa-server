import express from 'express';
import depedencyInjectorLoader from './depedencyInjector';
import expressLoader from './express';
import mongooseLoader from './mongoose';
import models from './model';
import Logger from './logger';

export default async ({ expressApp }: { expressApp: express.Application }): Promise<void> => {
  const mongoConnection = await mongooseLoader();
  Logger.info('MongoDb connected');

  await depedencyInjectorLoader({ mongoConnection, models });
  Logger.info('Depedency injector loaded');

  await expressLoader({ app: expressApp });
  Logger.info('Express loaded');
};

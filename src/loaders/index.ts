import express from 'express';
import depedencyInjectorLoader from './depedencyInjector';
import expressLoader from './express';
import mongooseLoader from './mongoose';
import Logger from './logger';
import { userModel, cardVerificationModel } from '../models';

export default async ({ expressApp }: { expressApp: express.Application }): Promise<void> => {
  const mongoConnection = await mongooseLoader();
  Logger.info('MongoDb connected');

  const models = [
    {
      name: 'userModel',
      model: userModel,
    },
    {
      name: 'cardVerificationModel',
      model: cardVerificationModel,
    },
  ];

  await depedencyInjectorLoader({ mongoConnection, models });
  Logger.info('Depedency injector loaded');

  await expressLoader({ app: expressApp });
  Logger.info('Express loaded');
};

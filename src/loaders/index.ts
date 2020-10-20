import express from 'express';
import depedencyInjectorLoader from './depedencyInjector';
import expressLoader from './express';
import mongooseLoader from './mongoose';
import Logger from './logger';
import userModel from '../models/user';

export default async ({ expressApp }: { expressApp: express.Application }): Promise<void> => {
  const mongoConnection = await mongooseLoader();
  Logger.info('MongoDb connected');

  const userModelObject = {
    name: 'userModel',
    model: userModel,
  };

  await depedencyInjectorLoader({ mongoConnection, models: [userModelObject] });
  Logger.info('Depedency injector loaded');

  await expressLoader({ app: expressApp });
  Logger.info('Express loaded');
};

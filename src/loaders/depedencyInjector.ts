import { Container } from 'typedi';
import LoggerInstance from './logger';

export default ({ mongoConnection, models }: { mongoConnection; models: { name: string; model: any }[] }): void => {
  try {
    models.forEach((model) => {
      Container.set(model.name, model.model);
    });

    Container.set('logger', LoggerInstance);
  } catch (error) {
    LoggerInstance.error('Error on depedency injector loader: %o', error);
    throw error;
  }
};

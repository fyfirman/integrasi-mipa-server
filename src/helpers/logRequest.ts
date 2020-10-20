import { Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import { Logger } from 'winston';

const logRequest = (req: Request, res: Response, next: NextFunction) : void => {
  const logger: Logger = Container.get('logger');

  // logger.debug(`${req.method} ${req.originalUrl}`);
  // logger.debug('Body:\n%o', req.body);

  next();
};

export default logRequest;

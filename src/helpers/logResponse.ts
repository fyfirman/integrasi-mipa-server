import { Request, Response } from 'express';
import { Container } from 'typedi';
import { Logger } from 'winston';

const logResponse = (req: Request, res: Response, message) : void => {
  const logger: Logger = Container.get('logger');
  logger.info(`${req.method} ${req.originalUrl} | ${res.statusCode} ${message}`);
};

export default logResponse;

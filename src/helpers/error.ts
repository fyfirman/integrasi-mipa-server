import { Request, Response, NextFunction } from 'express';
import { isCelebrate } from 'celebrate';
import { Container } from 'typedi';
import { Logger } from 'winston';

export class RestError extends Error {
  private statusCode = 500;

  constructor(statusCode: number, message: string) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }

  public getStatusCode = () : number => this.statusCode
}

export const errorHandler = (error, req: Request, res: Response, next: NextFunction) : void => {
  const logger: Logger = Container.get('logger');

  if (!isCelebrate(error)) {
    const statusCode = error.getStatusCode() ? error.getStatusCode() : 500;
    res.status(statusCode).json({ success: false, message: error.message });
    logger.error(`${req.method} ${req.originalUrl} | ${statusCode} ${error.message}`);
  } else {
    res.status(400).json({ success: false, message: error.joi.message });
    logger.error(`${req.method} ${req.originalUrl} | ${400} ${error.message}`);
  }
};

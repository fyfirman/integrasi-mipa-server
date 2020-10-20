import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { errorHandler } from '../helpers/error';
import logRequest from '../helpers/logRequest';
import config from '../config';
import routes from '../api';

export default ({ app }: { app: express.Application }) : void => {
  app.get('/status', (req, res) => {
    res.status(200).end();
  });
  app.head('/status', (req, res) => {
    res.status(200).end();
  });

  app.use(cors());
  app.use(bodyParser.json());
  app.use(logRequest);

  app.use(config.api.prefix, routes());

  app.use(errorHandler);
};

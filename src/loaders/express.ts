import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { errorHandler } from '../helpers/error';
import logRequest from '../helpers/logRequest';
import config from '../config';
import routes from '../api';

export default ({ app }: { app: express.Application }): void => {
  app.get('/status', (req, res) => {
    res.status(200).end();
  });
  app.head('/status', (req, res) => {
    res.status(200).end();
  });

  app.use(cors());
  app.use(bodyParser.json({ limit: '50mb', extended: true }));
  app.use(logRequest);

  if (config.mode === 'production') {
    app.use(routes());
  } else {
    app.use(config.api.prefix, routes());
  }

  app.use(errorHandler);
};

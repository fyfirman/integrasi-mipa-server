import { Router } from 'express';
import user from './routes/user';
import auth from './routes/auth';
import cardVerification from './routes/cardVerification';

export default (): Router => {
  const app = Router();
  user(app);
  auth(app);
  cardVerification(app);

  return app;
};

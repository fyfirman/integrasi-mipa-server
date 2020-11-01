import { Router } from 'express';
import user from './routes/user';
import auth from './routes/auth';
import cardVerification from './routes/cardVerification';
import kaBEMCandidate from './routes/kaBEMCandidate';

export default (): Router => {
  const app = Router();
  user(app);
  auth(app);
  cardVerification(app);
  kaBEMCandidate(app);

  return app;
};

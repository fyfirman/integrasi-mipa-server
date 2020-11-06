import { Router } from 'express';
import user from './routes/user';
import auth from './routes/auth';
import cardVerification from './routes/cardVerification';
import kaBEMCandidate from './routes/kaBEMCandidate';
import BPMCandidate from './routes/BPMCandidate';
import kaHimCandidate from './routes/kaHimCandidate';
import vote from './routes/vote';

export default (): Router => {
  const app = Router();
  user(app);
  auth(app);
  cardVerification(app);
  kaBEMCandidate(app);
  BPMCandidate(app);
  kaHimCandidate(app);
  vote(app);

  return app;
};

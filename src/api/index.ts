import { Router } from 'express';
import user from './routes/user';
import auth from './routes/auth';

export default (): Router => {
  const app = Router();
  user(app);
  auth(app);

  return app;
};

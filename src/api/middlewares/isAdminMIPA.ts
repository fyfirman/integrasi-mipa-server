import { Request, NextFunction } from 'express';
import { RestError } from '../../helpers/error';
import { roleConstant } from '../../constant';

const isAdminMIPA = (req: Request, res: Response, next: NextFunction): void => {
  if (req.currentUser === undefined) {
    throw new RestError(500, 'Endpoint should be attach current user');
  }

  if (req.currentUser.role !== roleConstant.ADMIN_MIPA) {
    throw new RestError(
      403,
      `Unauthenticed. Endpoint only for Admin MIPA. Your role is ${req.currentUser.role}`,
    );
  }

  next();
};

export default isAdminMIPA;

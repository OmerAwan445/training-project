import { Router } from 'express';

import Paths from '@src/common/constants/Paths';
import AuthRoutes from './AuthRoutes';
import UserRoutes from './UserRoutes';
import { isAuthenticated } from '@src/common/middlewares/auth';

const apiRouter = Router();

// Add AuthRoutes
apiRouter.use(Paths.Auth.Base, AuthRoutes);
apiRouter.use(Paths.Users.Base, isAuthenticated, UserRoutes);


export default apiRouter;

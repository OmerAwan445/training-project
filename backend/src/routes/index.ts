import { Router } from 'express';

import Paths from '@src/common/constants/Paths';
import UserRoutes from './UserRoutes';

const apiRouter = Router();

// Add UserRouter
apiRouter.use(Paths.Users.Base, UserRoutes);


export default apiRouter;

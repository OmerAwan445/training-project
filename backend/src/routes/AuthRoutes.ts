// ** Add authRouter ** //

import Paths from '@src/common/constants/Paths';
import AuthController from '@src/controllers/AuthController';
import { Router } from 'express';

// Init router
const authRouter = Router();

// Get all users
authRouter.post(Paths.Auth.signup, AuthController.signup);
authRouter.post(Paths.Auth.login, AuthController.login);

export default authRouter;
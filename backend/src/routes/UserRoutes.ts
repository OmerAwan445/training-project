// ** Add UserRouter ** //

import Paths from '@src/common/constants/Paths';
import UserController from '@src/controllers/UserController';
import { Router } from 'express';

// Init router
const userRouter = Router();

// Get all users
userRouter.get(Paths.Users.Get,  UserController.getUserProfile);

export default userRouter;
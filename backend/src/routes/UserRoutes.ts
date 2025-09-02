// ** Add UserRouter ** //

import Paths from "@src/common/constants/Paths";
import { Router } from "express";
import UserControllers from "../controllers/UserControllers";

// Init router
const userRouter = Router();

// Get all users
userRouter.get(Paths.Users.Get, UserControllers.getAll);
userRouter.post(Paths.Users.Add, UserControllers.add);
userRouter.put(Paths.Users.Update, UserControllers.update);
userRouter.delete(Paths.Users.Delete, UserControllers.delete);

export default userRouter;
// @src/routes/Auth.ts

import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import { NextFunction, Request, Response } from 'express';
import logger from 'jet-logger';
// You will need your user service for signing up
import UserService from '@src/services/UserService';
// Import the authentication middleware we just created
import { SignupRequestBody } from '@src/common/types';
import bcrypt from 'bcrypt';
import passport from 'passport';
import { IUser } from '@src/models/User';


// ===================================================================================
//                                  Signup Route
// ===================================================================================


async function signup(req: Request<object, object,
  SignupRequestBody>, res: Response) {
  const { password, email, name } = req.body;

  // Basic validation
  if (!password || !email || !name) {
    return res.status(HttpStatusCodes.BAD_REQUEST).json({
      error: 'Missing required fields: password, email, name.',
    });
  }

  try {
    // Check if user already exists
    const existingUser = await UserService.findByEmail(email);
    if (existingUser) {
      return res.status(HttpStatusCodes.CONFLICT).json({
        error: 'Email already exists.',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await UserService.create({ password: hashedPassword, email, name });

    // // After creating the user, log them in automatically using `req.login`
    // req.login(newUser, (err) => {
    //   if (err) {
    //     // If there's an error during login, send an error response
    //     return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
    //       error: 'User created but failed to log in.',
    //     });
    //   }
    //   // If login is successful, send back the user data
    // });
    logger.info(`User created successfully: ${JSON.stringify(newUser)}`);
    return res.status(HttpStatusCodes.CREATED).json(newUser);
  } catch (error) {
    logger.err(error as Error);
    return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
      error: 'An error occurred during signup.',
    });
  }
}

// ===================================================================================
//                                  Login Route
// ===================================================================================
function login(req: Request, res: Response, next: NextFunction) {

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  passport.authenticate('local', (err: Error, user: IUser | false, info: { message: string }) => {
    // This callback is executed after your LocalStrategy's `done` is called.

    // 1. Handle any server errors
    if (err) {
      return next(err); // Pass the error to your central error handler
    }

    // 2. Handle authentication failure
    if (!user) {
      // The 'info' object contains the failure message from your strategy.
      // e.g., { message: 'Incorrect password.' }
      return res.status(HttpStatusCodes.UNAUTHORIZED).json({ error: info.message });
    }

    // 3. Handle success
    // If you are here, the user was authenticated successfully.
    // YOU MUST MANUALLY LOG THE USER IN when using a custom callback.
    // `req.login` establishes the session.
    req.login(user, (loginErr) => {
      if (loginErr) {
        return next(loginErr);
      }

      // If login is successful, send the success response.
      return res.status(HttpStatusCodes.OK).json({
        message: 'Login successful.',
        user: user,
      });
    });
  })(req, res, next);
}

// // ===================================================================================
// //                                  Protected Route
// // ===================================================================================
// // We apply our `isAuthenticated` middleware here.
// // Only authenticated users will be able to access this route.
// Auth.get(
//   '/profile',
//   isAuthenticated,
//   (req: Request, res: Response) => {
//     // If the request reaches this point, it means `isAuthenticated` called `next()`.
//     // The user's data is available on `req.user`, attached by Passport's deserializer.
//     res.status(HttpStatusCodes.OK).json({
//       message: 'You have accessed a protected route!',
//       user: req.user,
//     });
//   },
// );

// // ===================================================================================
// //                                  Logout Route
// // ===================================================================================
// Auth.post('/logout', (req: Request, res: Response) => {
//   // `req.logout()` is a method added by Passport.js to terminate a login session.
//   req.logout((err) => {
//     if (err) {
//       return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ 
//         error: 'An error occurred during logout.', 
//       });
//     }
//     // If logout is successful, send a confirmation message.
//     res.status(HttpStatusCodes.OK).json({ message: 'Logout successful.' });
//   });
// });


export default {
  signup,
  login,
} as const;
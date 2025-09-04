import { Request, Response, NextFunction } from 'express';
import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';

/**
 * Middleware to ensure the user is authenticated.
 * If authenticated, the request is passed to the next handler.
 * If not, a 401 Unauthorized error is sent.
 */
export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.isAuthenticated()) {
    return next();
  }
  // If not authenticated, send an error response.
  res.status(HttpStatusCodes.UNAUTHORIZED).json({ error: 'User not authenticated.' });
};
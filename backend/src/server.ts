import { NodeEnvs } from '@src/common/constants';
import ENV from '@src/common/constants/ENV';
import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import Paths from '@src/common/constants/Paths';
import { RouteError } from '@src/common/util/route-errors';
import BaseRouter from '@src/routes';
import express, { NextFunction, Request, Response } from 'express';
import session from 'express-session';
import helmet from 'helmet';
import logger from 'jet-logger';
import morgan from 'morgan';
import passport from 'passport';
import path from 'path';
// This line executes the code in passport.ts, configuring the strategies.
import '@src/config/passport';
import connectDB from './config/db';

/******************************************************************************
                                Setup
******************************************************************************/

const app = express();

// For passport js
app.use(session({
  name: 'sessionId',
  secret: ENV.PassportSecret ?? 'default_secret',
  resave: false,
  saveUninitialized: false,
  rolling: true, // resets timer on every request
  cookie: { secure: false,
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours * 60 minutes * 60 seconds * 1000 ms
  },
}));

app.use(passport.initialize());
app.use(passport.session()); // Allows passport to use sessions

// **** Middleware **** //

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Show routes called in console during development
if (ENV.NodeEnv === NodeEnvs.Dev) {
  app.use(morgan('dev'));
}

// Security
if (ENV.NodeEnv === NodeEnvs.Production) {
  // eslint-disable-next-line n/no-process-env
  if (!process.env.DISABLE_HELMET) {
    app.use(helmet());
  }
}

connectDB();

// Add APIs, must be after middleware
app.use(Paths.Base, BaseRouter);

// Add error handler
app.use((err: Error, _: Request, res: Response, next: NextFunction) => {
  if (ENV.NodeEnv !== NodeEnvs.Test.valueOf()) {
    logger.err(err, true);
  }
  let status = HttpStatusCodes.BAD_REQUEST;
  if (err instanceof RouteError) {
    status = err.status;
    res.status(status).json({ error: err.message });
  }
  return next(err);
});


// **** FrontEnd Content **** //

// Set views directory (html)
const viewsDir = path.join(__dirname, 'views');
app.set('views', viewsDir);

// Set static directory (js and css).
const staticDir = path.join(__dirname, 'public');
app.use(express.static(staticDir));

export default app;

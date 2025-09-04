// @src/config/passport.ts

import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';

import UserService from '@src/services/UserService';
import { IUser } from '@src/models/User';
import logger from 'jet-logger';

// 1. Define the Local Strategy
passport.use(new LocalStrategy(
  // This options object is the crucial change.
  // It tells Passport to use the 'email' field for the username.
  { usernameField: 'email' },

  // The callback function remains the same.
  // The 'email' parameter will now correctly receive req.body.email.
  async (email, password, done) => {
    try {
      // Find the user by their email.
      const user = await UserService.findByEmail(email);
      if (!user) {
        logger.warn('No user found with email:');
        // If no user is found, call done with false.
        return done(null, false, { message: 'No user with that email found.' });
      }

      // Check if the password is correct using the async version of bcrypt.
      // bcrypt.compare is non-blocking and preferred over compareSync in a server environment.
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return done(null, false, { message: 'Incorrect password.' });
      }

      // If credentials are correct, return the user object.
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  },
));

// 2. Serialize User
// This function determines what data of the user object should be stored in the session.
// We only store the user ID to keep the session cookie small and secure.
passport.serializeUser((user, done) => {
  // The 'user' object here is the one returned from the LocalStrategy.
  // We cast it to IUser to ensure type safety.
  done(null, (user as IUser).id);
});

// 3. Deserialize User
// This function is called on every authenticated request.
// It uses the ID from the session to retrieve the full user object from the database.
// This full user object is then attached to the request as `req.user`.
passport.deserializeUser(async (id: string, done) => {
  try {
    // Note: Ensure your UserService.findById can handle the type of 'id'.
    // It might be a string or you might need to parse it to a number.
    const user = await UserService.findById(id);
    if (user) {
      done(null, user);
    } else {
      done(new Error('User not found'), null);
    }
  } catch (err) {
    done(err, null);
  }
});
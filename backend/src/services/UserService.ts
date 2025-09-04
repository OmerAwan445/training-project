
import User, { IUser } from '@src/models/User';

const findById = (id: string): Promise<IUser | null> => {
  return User.findById(id);
};

const findByEmail = (email: string): Promise<IUser | null> => {
  return User.findOne({ email });
};

/******************************************************************************
                                Export default
******************************************************************************/
const create = async (userData: Partial<IUser>): Promise<IUser> => {
  const user = new User(userData);
  return await user.save();
};

export default {
  findById,
  findByEmail,
  create,
} as const;

import UserService from '@src/services/UserService';
import { Request, Response } from 'express';

const getUserProfile = async (req: Request, res: Response) => {
  try {
    // Assuming user ID is available in req.user or req.params.id
    const userId =
      typeof req.user === 'object' && req.user !== null && 'id' in req.user
        ? (req.user as { id: string }).id
        : undefined;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required.' });
    }

    // Replace with your user fetching logic, e.g., using a User model
    const user = await UserService.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    return res.status(200).json({ profile: user });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Server error.', error: error.message });
  }
};

export default {
  getUserProfile,
} as const;

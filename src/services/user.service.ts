import User, { IUser, NotificationPreference } from '../models/User.model';

export const createUser = async (name: string, email: string, phone?: string) => {
  return User.create({ name, email, phone, preferences: [] });
};

export const updatePreferences = async (
  userId: string, 
  preferences: NotificationPreference[]
): Promise<IUser | null> => {
  return User.findByIdAndUpdate(
    userId,
    { $set: { preferences } },
    { new: true }
  );
};

export const findUserById = async (userId: string) => {
  return User.findById(userId);
};

export const getAllUsers = async () => {
  return User.find();
};
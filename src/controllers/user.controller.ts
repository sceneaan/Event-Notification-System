import { Request, Response, NextFunction } from 'express';
import { createUser, updatePreferences, findUserById, getAllUsers } from '../services/user.service';
import mongoose from 'mongoose';

export const registerUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, phone } = req.body;
    if (!name || !email) {
      res.status(400).json({ message: 'Name and email are required' });
      return;
    }
    if (!phone) {
      res.status(400).json({ message: 'Phone is required' });
      return;  
    }
    const phoneStr = String(phone);
    if (phoneStr.length < 10) {
      res.status(400).json({ message: 'Phone number must be at least 10 characters long' });
      return;
    } 

    const user = await createUser(name, email, phoneStr);
    res.status(201).json(user);
  } catch (error: any) {
    next(error);
  }
};

export const updateUserPreferences = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { userId } = req.params;
    const { preferences } = req.body;
    console.log('preferences: ', preferences.length);

    if (!userId) {
        res.status(400).json({ message: 'User ID is required' });
        return;
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
       res.status(400).json({ message: 'Invalid user ID' });
       return;
    }

    if (!preferences || !Array.isArray(preferences) || preferences.length === 0) {
      res.status(400).json({ message: 'Please enter the preferences' });
      return;
    }
    
    const user = await updatePreferences(userId, preferences);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    
    res.json({ message: 'Preference has been updated', user });
  } catch (error: any) {
    next(error);
  }
};

export const getUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { userId } = req.params;
    const user = await findUserById(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    
    res.json(user);
  } catch (error: any) {
    next(error);
  }
};

export const getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error: any) {
    next(error);
  }
};
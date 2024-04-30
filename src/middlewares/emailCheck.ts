import { NextFunction, Request, Response } from 'express';
import { User } from '../models/user';

export const checkExistingEmail = async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;

  const existingEmail = await User.findOne({ email: email });

  if(existingEmail) {
    return res.status(400).json({
      status: false,
      method: req.method,
      url: req.url,
      message: "Email is already in use",
    });
  }

  next();
}
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import Joi from 'joi';

import { User } from '../models/user';

const schema = Joi.object({
  name: Joi.string().min(6).max(2255).required(),
  email: Joi.string().min(6).max(2255).required().email(),
  password: Joi.string().min(8).max(2255).required(),
});

export const showUserDetail = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  try {
    const userData = await User.findById(userId);
    res.render("users/detail", { users: userData });
  } catch (err) {
    console.error(err);
  }
}

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  const salt = bcrypt.genSaltSync(13);

  const hashedPassword = await bcrypt.hash(password, salt);

  const { error } = schema.validate(req.body)

  if(name && email !== null) {
    if(error) {
      return res.status(400).send({
        error
      })
    }
    try {
      const result = await User.create({
        name: name,
        email: email,
        password: hashedPassword,
      });

      return res.status(201).send(result);
    } catch (err) {
      console.error(err);
    }
  } else {
    return res.send({
      status: false,
      method: req.method,
      url: req.url,
      message: "Empty data is not allowed"
    })
  }
}

// export const login = async (req: Request, res: Response) => {
//   const { email, password } = req.body;

//   if(email && password !== null) {
//     res.status(200).send({
//       message: "Successfully logged in!"
//     });
//   }
// }
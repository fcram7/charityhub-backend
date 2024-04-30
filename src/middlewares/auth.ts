import { NextFunction, Request, Response } from 'express';
import bcrypt from "bcrypt";
import jwt, { VerifyErrors } from "jsonwebtoken";

import { User } from '../models/user';

interface tokenGeneratorParameter {
  email: string | undefined,
  password: string | undefined
}

export const loginAuth = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  
  const loggedEmail = await User.findOne({ email : email });

  if(!loggedEmail) {
    return res.status(400).json({
      status: false,
      method: req.method,
      url: req.url,
      message: "Email is not registered!",
    });
  }

  const passwordIsValid = await bcrypt.compare(password, loggedEmail.password!);

  if(!passwordIsValid) {
    return res.status(40).json({
      status: false,
      method: req.method,
      url: req.url,
      message: "Password doesn't match!"
    });
  }

  const accessToken = generateAccessToken({ email, password });
  res.cookie("session", accessToken, { 
    httpOnly: true,
    secure: true,
    sameSite: "strict"
  });
  
  const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
  const refreshToken = jwt.sign({ email: email, password: password}, refreshTokenSecret!);

  return res.send({ accessToken: accessToken, refreshToken: refreshToken });
}

const generateAccessToken = ({ email, password }: tokenGeneratorParameter) => {
  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
  const accessToken = jwt.sign({ email: email, password: password }, accessTokenSecret!, { expiresIn: "1h" });
  return accessToken;
}

export const generateRefreshToken = (req: Request, res: Response) => {
  const refreshToken = req.headers["authorization"];
  const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
  
  if(refreshToken === null) {
    return res.status(401).send({ message: "Invalid token"} );
  }

  jwt.verify(refreshToken!, refreshTokenSecret as string, (err: VerifyErrors | null, user: any) => {
    if (err) {
      console.error(err);
      return res.status(403).send({ message: "Not authorized "})
    }

    if (user) {
      const { email, password } = user as tokenGeneratorParameter
      const accessToken = generateAccessToken({ email: email, password: password })

      return res.send({ accessToken: accessToken });
    }
  });
  return res.send({ refreshToken: refreshToken });
}

export const validateToken = (req: Request, res: Response, next: NextFunction) => {
  const secret = process.env.ACCESS_TOKEN_SECRET;
  const token = req.cookies.session;

  if (!token) {
    return res.status(401).send({ message: "Invalid token "});
  }
  
  jwt.verify(token, secret as string, (err: VerifyErrors | null, user: any) => {
    if (err) {
      return res.status(403).send({
        message: "Not authorized!",
      });
    } 

    console.log(token);
    return res.status(200).send({ message: "Token OK!" });
  });

  next();
}
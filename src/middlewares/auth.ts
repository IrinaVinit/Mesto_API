import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export const auth = (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .send({ message: 'Необходима авторизация' });
  }

  const token = authorization.replace('Bearer ', '');
  let payload: jwt.JwtPayload;

  try {
    payload = jwt.verify(token, 'some-secret-key') as jwt.JwtPayload;
  } catch (err) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .send({ message: 'Необходима авторизация' });
  }

  req.user = { _id: payload._id };

  return next();
};

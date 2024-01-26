import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import UnauthorizedError from '../errors/UnauthorizedError';

export const auth = (req: Request, res: Response, next: NextFunction) => {
  const cookie = req.cookies?.token;
  if (!cookie) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }

  const token = cookie;
  let payload: jwt.JwtPayload;

  try {
    payload = jwt.verify(token, 'some-secret-key') as jwt.JwtPayload;
    req.user = { _id: payload._id };
  } catch (err) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }

  return next();
};

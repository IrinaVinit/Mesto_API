import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';

export default (
  err: { statusCode: number; message: string; },
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err.statusCode) {
    return res
      .status(err.statusCode)
      .send({ message: err.message });
  }
  if ('code' in err && err.code === 11000) {
    return res
      .status(StatusCodes.CONFLICT)
      .send({ message: 'Пользователь с указанным email уже зарегистирован' });
  }

  if (err instanceof Error && err.name === 'NotFoundError') {
    return res.status(StatusCodes.NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден' });
  }
  if (err instanceof mongoose.Error.CastError) {
    return res.status(StatusCodes.BAD_REQUEST).send({ message: 'Не валидный ID пользователя' });
  }
  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(StatusCodes.BAD_REQUEST).send({ message: 'Переданы некорректные данные при запросе' });
  }
  res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .send({ message: 'Произошла ошибка на сервере' });

  return next();
};

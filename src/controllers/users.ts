import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import User from '../models/user';

const bcrypt = require('bcrypt');

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: 'Oшибка при загрузке пользователей' });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).orFail(() => {
      const err = new Error('Пользователь не найден');
      err.name = 'NotFoundError';
      return err;
    });
    return res.send(user);
  } catch (err) {
    if (err instanceof Error && err.name === 'NotFoundError') {
      return res.status(StatusCodes.NOT_FOUND).send({ message: err });
    }
    if (err instanceof mongoose.Error.CastError) {
      return res.status(StatusCodes.BAD_REQUEST).send({ message: 'Не валидный ID пользователя' });
    }
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: 'Oшибка на стороне сервера' });
  }
};

export const getMyUser = async (req: Request, res: Response) => {
  const user = await User.findById(req.user._id);
  res.send(user);
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  const hashPassword = await bcrypt.hash(password, 10);
  try {
    const user = await User.create({
      name, about, avatar, email, password: hashPassword,
    });
    return res.status(StatusCodes.CREATED).send(user);
  } catch (err) {
    return next(err);
    // if (err instanceof mongoose.Error.ValidationError) {
    // eslint-disable-next-line max-len
    //   return res.status(StatusCodes.BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании пользователя' });
    // }
    // eslint-disable-next-line max-len
    // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка при создании пользователя' });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { name, about } = req.body;
  try {
    const user = await User.findByIdAndUpdate(req.user._id, { name, about }, {
      new: true,
      runValidators: true,
    });
    return res.send(user);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return res.status(StatusCodes.BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении профиля' });
    }
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка при обновлении профиля' });
  }
};

export const updateAvatar = async (req: Request, res: Response) => {
  const { avatar } = req.body;
  try {
    const user = await User.findByIdAndUpdate(req.user._id, { avatar }, {
      new: true,
      runValidators: true,
    });
    return res.send(user);
  } catch (err) {
    if (err instanceof Error && err.name === 'NotFoundError') {
      return res.status(StatusCodes.NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден' });
    }
    if (err instanceof mongoose.Error.ValidationError) {
      return res.status(StatusCodes.BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении аватара' });
    }
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка при обновлении аватара' });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return Promise.reject(new Error('Пользователя с такими данными не существует'));
  }
  const matched = await bcrypt.compare(password, user.password);
  if (!matched) {
    return Promise.reject(new Error('Пользователя с такими данными не существуе'));
  }
  const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
  return res.status(StatusCodes.OK).cookie('token', token).send();
};

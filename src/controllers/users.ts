import { Request, Response } from 'express';

import mongoose from 'mongoose';
import User from '../models/user';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(500).send({ message: 'Oшибка при загрузке пользователей' });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).orFail(() => {
      const error = new Error('Пользователь не найден');
      error.name = 'NotFoundError';
      return error;
    });
    return res.send(user);
  } catch (err) {
    if (err instanceof Error && err.name === 'NotFoundError') {
      return res.status(404).send({ message: err.message });
    }
    if (err instanceof mongoose.Error.CastError) {
      return res.status(400).send({ message: 'Не валидный ID пользователя' });
    }
    return res.status(500).send({ message: 'Oшибка на стороне сервера' });
  }
};

export const createUser = async (req: Request, res: Response) => {
  const { name, about, avatar } = req.body;
  try {
    const user = await User.create({ name, about, avatar });
    return res.send(user);
  } catch {
    return res.status(500).send({ message: 'Произошла ошибка при создании пользователя' });
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
  } catch {
    return res.status(500).send({ message: 'Произошла ошибка при обновлении профиля' });
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
  } catch {
    return res.status(500).send({ message: 'Произошла ошибка при обновлении аватара' });
  }
};

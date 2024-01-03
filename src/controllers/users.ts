import { Request, Response } from 'express';
import { StatusCodes } from '../constants/statusCodes';
import User from '../models/user';

export const getUsers = (req: Request, res: Response) => User.find({})
  .then((users) => res.send({ data: users }))
  .catch(() => {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка при загрузке пользователей' });
  });

export const getUserById = (req: Request, res: Response) => {
  const { _id } = req.body;
  User.find({ _id })
    .then((user) => res.send({ data: user }))
    .catch(() => {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: 'Пользователь не найден' });
    });
};

export const createUser = async (req: Request, res: Response) => {
  const { name, about, avatar } = req.body;
  try {
    const user = await User.create({ name, about, avatar });
    return res.send(user);
  } catch {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка при создании пользователя' });
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

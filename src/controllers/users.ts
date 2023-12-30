import { Request, Response } from 'express';
import User from '../models/user';

export const getUsers = (req: Request, res: Response) => User.find({})
  .then((users) => res.send({ data: users }))
  .catch(() => {
    res.status(500).send({ message: 'Произошла ошибка при загрузке пользователей' });
  });

export const getUserById = (req: Request, res: Response) => {
  const { _id } = req.body;
  User.find({ _id })
    .then((user) => res.send({ data: user }))
    .catch(() => {
      res.status(500).send({ message: 'Пользователь не найден' });
    });
};

export const createUser = (req: Request, res: Response) => {
  const { name, about, avatar } = req.body;
  return User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка при создании пользователя' }));
};

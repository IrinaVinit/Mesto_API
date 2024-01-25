import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import User from '../models/user';

const bcrypt = require('bcrypt');

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    next(err);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).orFail(() => {
      const err = new Error('Пользователь не найден');
      err.name = 'NotFoundError';
      return err;
    });
    res.send(user);
  } catch (err) {
    next(err);
  }
};

export const getMyUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user._id);
    res.send(user);
  } catch (err) {
    next(err);
  }
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
    res.status(StatusCodes.CREATED).send(user);
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, about } = req.body;
  try {
    const user = await User.findByIdAndUpdate(req.user._id, { name, about }, {
      new: true,
      runValidators: true,
    });
    res.send(user);
  } catch (err) {
    next(err);
  }
};

export const updateAvatar = async (req: Request, res: Response, next: NextFunction) => {
  const { avatar } = req.body;
  try {
    const user = await User.findByIdAndUpdate(req.user._id, { avatar }, {
      new: true,
      runValidators: true,
    });
    res.send(user);
  } catch (err) {
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return Promise.reject(new Error('Пользователя с такими данными не существует'));
    }
    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      return Promise.reject(new Error('Пользователя с такими данными не существует'));
    }
    const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
    return res.status(StatusCodes.OK).cookie('token', token, {
      maxAge: 3600000,
      httpOnly: true,
      sameSite: true,
    })
      .end();
  } catch (err) {
    return next(err);
  }
};

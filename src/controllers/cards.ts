import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import Card from '../models/card';

export const createCard = async (req: Request, res: Response) => {
  const { name, link } = req.body;
  try {
    const card = await Card.create({
      name,
      link,
      owner: req.user._id,
    });
    return res.send(card);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return res.status(StatusCodes.BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании карточки' });
    }
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка при создании карточки' });
  }
};

export const getCards = async (req: Request, res: Response) => {
  try {
    const cards = await Card.find({});
    return res.send(cards);
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка при загрузке карточек' });
  }
};

export const deleteCard = async (req: Request, res: Response) => {
  try {
    const card = await Card.findByIdAndRemove(req.params.cardId).orFail(() => {
      const error = new Error('Пользователь не найден');
      error.name = 'NotFoundError';
      return error;
    });
    return res.send(card);
  } catch (err) {
    if (err instanceof Error && err.name === 'NotFoundError') {
      return res.status(StatusCodes.NOT_FOUND).send({ message: err });
    }
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: 'Oшибка на стороне сервера' });
  }
};

const updateLike = async (req: Request, res: Response, method: string) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { [method]: { likes: req.user._id } },
      { new: true },
    )
      .orFail(() => {
        const err = new Error('Нет карточки по заданному _id');
        err.name = 'NotFoundError';
        return err;
      });
    return res.send(card);
  } catch (err) {
    if (err instanceof Error && err.name === 'NotFoundError') {
      return res.status(StatusCodes.NOT_FOUND).send({ message: err });
    }
    if (err instanceof mongoose.Error.ValidationError) {
      return res.status(StatusCodes.BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
    }
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: 'Oшибка на стороне сервера' });
  }
};

export const likeCard = (req: Request, res: Response) => updateLike(req, res, '$addToSet');

export const dislikeCard = (req: Request, res: Response) => updateLike(req, res, '$pull');

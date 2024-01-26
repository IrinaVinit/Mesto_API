import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import InvalidRequest from '../errors/InvalidRequest';
import ForbiddenError from '../errors/ForbiddenError';
import NotFoundError from '../errors/NotFoundError';
import Card from '../models/card';

export const createCard = async (req: Request, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  try {
    const card = await Card.create({
      name,
      link,
      owner: req.user._id,
    });
    res.status(StatusCodes.CREATED).send(card);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      next(new InvalidRequest('Переданы некорректные данные'));
    } else {
      next(err);
    }
  }
};

export const getCards = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cards = await Card.find({});
    res.send(cards);
  } catch (err) {
    next(err);
  }
};

export const deleteCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const card = await Card.findById(req.params.cardId).orFail(() => {
      throw new NotFoundError('Нет карточки по заданному _id');
    });
    if (card.owner.toString() !== req.user?._id) {
      throw new ForbiddenError('Вы можете удалять только свои карточки');
    }
    const cardToDelete = await card.deleteOne();
    res.status(StatusCodes.OK).send(cardToDelete);
  } catch (err) {
    next(err);
  }
};

const updateLike = async (req: Request, res: Response, method: string, next: NextFunction) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { [method]: { likes: req.user._id } },
      { new: true },
    )
      .orFail(() => {
        throw new NotFoundError('Нет карточки по заданному _id');
      });
    res.send(card);
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      next(new InvalidRequest('Переданы невалидные данные'));
    } else {
      next(err);
    }
  }
};

export const likeCard = (req: Request, res: Response, next: NextFunction) => updateLike(req, res, '$addToSet', next);

export const dislikeCard = (req: Request, res: Response, next: NextFunction) => updateLike(req, res, '$pull', next);

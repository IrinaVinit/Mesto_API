import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
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
    next(err);
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
      const error = new Error('Пользователь не найден');
      error.name = 'NotFoundError';
      return error;
    });
    if (card.owner.toString() !== req.user?._id) {
      const error = new Error('Вы можете удалять только свои карточки');
      error.name = 'AccessError';
      return error;
    }
    const cardToDelete = await card.deleteOne();
    return res.status(StatusCodes.OK).send(cardToDelete);
  } catch (err) {
    return next(err);
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
        const err = new Error('Нет карточки по заданному _id');
        err.name = 'NotFoundError';
        return err;
      });
    res.send(card);
  } catch (err) {
    next(err);
  }
};

export const likeCard = (req: Request, res: Response, next: NextFunction) => updateLike(req, res, '$addToSet', next);

export const dislikeCard = (req: Request, res: Response, next: NextFunction) => updateLike(req, res, '$pull', next);

import { Request, Response } from 'express';
import { StatusCodes } from 'constants/statusCodes';
import Card from '../models/card';

export const createCard = (req: Request, res: Response) => {
  const { name, link } = req.body;
  return Card.create({
    name,
    link,
    owner: req.user._id,
  })
    .then((card) => res.send(card))
    .catch((err) => res.status(500).send({ message: 'Произошла ошибка', err }));
};

export const getCards = (req: Request, res: Response) => Card.find({})
  .then((cards) => res.send({ data: cards }))
  .catch(() => {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка при загрузке карточек' });
  });

export const deleteCard = (req: Request, res: Response) => {
  const { _id } = req.body;
  Card.findByIdAndRemove({ _id })
    .then((card) => res.send({ data: card }))
    .catch(() => {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: 'ошибка при удалении карточки' });
    });
};

export const likeCard = (req: Request, res: Response) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.send(card))
    .catch(() => {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: 'ошибка на сервере' });
    });
};

export const dislikeCard = (req: Request, res: Response) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.send(card))
    .catch(() => {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: 'ошибка на сервере' });
    });
};

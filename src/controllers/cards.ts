import { Request, Response } from 'express';
import { IUserRequest } from '../types';
import Card from '../models/card';

export const createCard = (req: IUserRequest, res: Response) => {
  const { name, link } = req.body;
  return Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => res.status(500).send({ message: 'Произошла ошибка', err }));
};

export const getCards = (req: Request, res: Response) => Card.find({})
  .then((cards) => res.send({ data: cards }))
  .catch(() => {
    res.status(500).send({ message: 'Произошла ошибка при загрузке карточек' });
  });

export const deleteCard = (req: Request, res: Response) => {
  const { _id } = req.body;
  Card.findByIdAndRemove({ _id })
    .then((card) => res.send({ data: card }))
    .catch(() => {
      res.status(500).send({ message: 'ошибка при удалении карточки' });
    });
};

// {
//   "name": "card1",
//   "link": "https://dlfkdklfg"
// }

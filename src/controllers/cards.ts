import { NextFunction, Request, Response } from 'express';
import Card from '../models/card';
// import NotFoundError from '../errors/not-found-err';

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
    res.status(500).send({ message: 'Произошла ошибка при загрузке карточек' });
  });

export const deleteCard = (req: Request, res: Response) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => res.send(card))
    .catch(() => {
      res.status(500).send({ message: 'ошибка при удалении карточки' });
    });
};

// export const likeCard = (req: Request, res: Response) => {
//   const { cardId } = req.params;
//   Card.findByIdAndUpdate(
//     cardId,
//     { $addToSet: { likes: req.user._id } },
//     { new: true },
//   )
//     .then((card) => res.send(card))
//     .catch(() => {
//       res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: 'ошибка на сервере' });
//     });
// };

// export const dislikeCard = (req: Request, res: Response) => {
//   const { cardId } = req.params;
//   Card.findByIdAndUpdate(
//     cardId,
//     { $pull: { likes: req.user._id as Partial<Schema.Types.ObjectId> } },
//     { new: true },
//   )
//     .then((card) => res.send(card))
//     .catch(() => {
//       res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: 'ошибка на сервере' });
//     });
// };

const updateLike = (req: Request, res: Response, next: NextFunction, method: string) => {
  // const { params: { id } } = req;
  Card.findByIdAndUpdate(req.params.cardId, { [method]: { likes: req.user._id } }, { new: true })
    // .orFail(() => new NotFoundError('Нет карточки по заданному id'))
    .then((card) => {
      res.send(card);
    })
    .catch(next);
};

export const likeCard = (req: Request, res: Response, next: NextFunction) => updateLike(req, res, next, '$addToSet');

export const dislikeCard = (req: Request, res: Response, next: NextFunction) => updateLike(req, res, next, '$pull');

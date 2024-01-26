import { Router } from 'express';
import { createCardValidation, deleteCardValidation, updateLikeValidation } from '../validation/validation';
import {
  createCard, deleteCard, dislikeCard, getCards, likeCard,
} from '../controllers/cards';

const cardRouter = Router();

cardRouter.post('/', createCardValidation, createCard);
cardRouter.get('/', getCards);
cardRouter.delete('/:cardId', deleteCardValidation, deleteCard);
cardRouter.put('/:cardId/likes', updateLikeValidation, likeCard);
cardRouter.delete('/:cardId/likes', updateLikeValidation, dislikeCard);

export default cardRouter;

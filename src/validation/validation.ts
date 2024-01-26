const { celebrate, Joi } = require('celebrate');

const idValidation = Joi.string().length(24).hex().required();
const nameValidation = Joi.string().min(2).max(30);
const aboutValidation = Joi.string().min(2).max(200);
const linkValidation = Joi.string().uri();
const emailValidation = Joi.string().required().email();
const passwordValidation = Joi.string().required();

export const getUserByIdValidation = celebrate({
  params: Joi.object().keys({
    userId: idValidation,
  }),
});

export const createUserValidation = celebrate({
  body: Joi.object().keys({
    name: nameValidation,
    about: aboutValidation,
    avatar: linkValidation,
    email: emailValidation,
    password: passwordValidation,
  }),
});

export const updateUserValidation = celebrate({
  body: Joi.object().keys({
    name: nameValidation,
    about: aboutValidation,
  }),
});

export const updateAvatarValidation = celebrate({
  body: Joi.object().keys({
    avatar: linkValidation,
  }),
});

export const loginValidation = celebrate({
  body: Joi.object().keys({
    email: emailValidation,
    password: passwordValidation,
  }),
});

export const createCardValidation = celebrate({
  body: Joi.object().keys({
    name: nameValidation.required(),
    link: linkValidation.required(),
  }),
});

export const deleteCardValidation = celebrate({
  params: Joi.object().keys({
    cardId: idValidation,
  }),
});

export const updateLikeValidation = celebrate({
  params: Joi.object().keys({
    cardId: idValidation,
  }),
});

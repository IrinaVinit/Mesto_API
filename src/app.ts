import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import { errors } from 'celebrate';
import { createUserValidation, loginValidation } from './validation/validation';
import { errorLogger, requestLogger } from './middlewares/logger';
import { auth } from './middlewares/auth';
import { createUser, login } from './controllers/users';
import cardRouter from './routes/cards';
import userRouter from './routes/user';
import errorHandler from './middlewares/errorHandler';

const helmet = require('helmet');

const { PORT = 3003, MONGO_URL } = process.env;

const app = express();
app.use(cookieParser());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(MONGO_URL as string);
app.use(requestLogger);

app.post('/signin', loginValidation, login);
app.post('/signup', createUserValidation, createUser);

app.use(auth);
app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});

// "email": "kari@ty.ru",
// "password": "12345678"

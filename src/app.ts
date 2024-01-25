import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import { errors } from 'celebrate';
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
app.use(errors());
app.use(errorHandler);

mongoose.connect(MONGO_URL as string);
app.use(requestLogger);

app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);
app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.use(errorLogger);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});

// "email": "kari@ty.ru",
// "password": "12345678"

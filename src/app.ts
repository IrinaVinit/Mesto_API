import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import { auth } from './middlewares/auth';
import { createUser, login } from './controllers/users';
import cardRouter from './routes/cards';
import userRouter from './routes/user';

const helmet = require('helmet');

const { PORT = 3003, MONGO_URL } = process.env;
// большое спасибо за такие крутые рекомендации к ревью!
const app = express();
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(MONGO_URL as string);

app.use((req: Request, _res: Response, next: NextFunction) => {
  req.user = {
    _id: '65913fe8e464045ead0a864a',
  };

  next();
});

app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);
app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});

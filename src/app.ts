import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import cardRouter from './routes/cards';
import userRouter from './routes/user';

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use((req: Request, _res: Response, next: NextFunction) => {
  req.user = {
    _id: '65913fe8e464045ead0a864a',
  };

  next();
});

app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});

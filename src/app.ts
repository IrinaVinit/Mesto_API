import express from 'express';
import mongoose from 'mongoose';

const PORT = process.env.PORT || 3003;

const app = express();
mongoose.connect('mongodb://localhost:27017/mestodb');

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});

import mongoose from 'mongoose';

const validator = require('validator');

interface IUser {
  name: string;
  about: string;
  avatar: string;
}

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 200,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator: (value: String) => (validator.isURL(value, { protocols: ['http', 'https', 'ftp'], require_tld: true, require_protocol: true })),
      message: 'Введите корректную ссылку на картинку',
    },
  },
}, { versionKey: false });

export default mongoose.model<IUser>('user', userSchema);

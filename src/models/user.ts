import mongoose from 'mongoose';

const validator = require('validator');

interface IUser {
  name: string;
  about: string;
  avatar: string;
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: false,
    minlength: [2, 'Минимальная длина поля "name" - 2'],
    maxlength: [30, 'Максимальная длина поля "name" - 30'],
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    required: false,
    minlength: [2, 'Минимальная длина поля "about" - 2'],
    maxlength: [200, 'Максимальная длина поля "about" - 200'],
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    required: false,
    validate: {
      validator: (value: String) => (validator.isURL(value, { protocols: ['http', 'https', 'ftp'], require_tld: true, require_protocol: true })),
      message: 'Введите корректную ссылку на картинку',
    },
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    required: [true, 'Поле "email" должно быть заполнено'],
    validate: {
      validator: (email: string) => validator.isEmail(email),
      message: 'Введен некорректный email',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
}, { versionKey: false });

export default mongoose.model<IUser>('user', userSchema);

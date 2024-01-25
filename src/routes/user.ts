import { Router } from 'express';
import {
  getMyUser,
  getUserById, getUsers, updateAvatar, updateUser,
} from '../controllers/users';

const userRouter = Router();

userRouter.get('/', getUsers);
userRouter.get('/me', getMyUser);
userRouter.get('/:userId', getUserById);

userRouter.patch('/me', updateUser);
userRouter.patch('/me/avatar', updateAvatar);

export default userRouter;

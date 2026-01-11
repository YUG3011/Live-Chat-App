import express from "express";
import { getUserBySearch } from '../routecontrolers/userHandlerControler.js';
import isLogin from '../middleware/isLogin.js';
import { getcurrentchatters } from '../routecontrolers/userHandlerControler.js';

const userRouter = express.Router();

userRouter.get('/search',isLogin,getUserBySearch);

userRouter.get('/currentchatters',isLogin, getcurrentchatters);


export default userRouter;
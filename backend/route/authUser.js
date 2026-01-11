import express from 'express';
import { userLogin } from '../routecontrolers/userControler.js';
import { userRegister } from '../routecontrolers/userControler.js';
import { userLogout } from '../routecontrolers/userControler.js';


const router = express.Router();

router.post('/register',userRegister);

router.post('/login',userLogin);

router.post('/logout',userLogout);




export default router;
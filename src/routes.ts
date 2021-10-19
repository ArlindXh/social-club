import { Router } from 'express';
import register from './controllers/user/register';
import login from './controllers/user/login';
import selfInfo from './controllers/user/self-info';
import updatePassword from './controllers/user/update-password';
import find from './controllers/user/find';
import findAll from './controllers/user/find-all';
import like from './controllers/user/like';
import unlike from "./controllers/user/unlike"

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', selfInfo);
router.patch('/me/update-password', updatePassword);
router.get('/user/:id', find);
router.post('/user/:id/like', like);
router.post('/user/:id/unlike', unlike);
router.get('/most-liked', findAll);


export default router;

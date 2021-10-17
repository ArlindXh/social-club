import { Router } from 'express';
import register from './controllers/user/register';

const swaggerUiOptions = {
  customCss: '.swagger-ui .topbar { display: none }'
};

const router = Router();

router.post('/user/register', register);



export default router;

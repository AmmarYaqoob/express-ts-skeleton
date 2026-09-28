import { Router } from 'express';
import config from '../config';
import pingCtrl from '../controllers/ping';
import responseMiddleware from '../middlewares/response';

let prefix =  `${config.api.baseURL}/ping`;
const router = Router();

router.get('/', pingCtrl.ping, responseMiddleware);

export default {
  path: prefix,
  router,
};


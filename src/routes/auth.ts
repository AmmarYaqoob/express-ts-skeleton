import { Router } from 'express';
import config from '../config/index';
import ctrl from '../controllers/users';
import responseMiddleware from '../middlewares/response';

let prefix =  `${config.api.baseURL}/auth`;

const router = Router();
router.post('/login', ctrl.login, responseMiddleware);
router.post('/signup', ctrl.signUp, responseMiddleware);
router.post('/verifyuserhash', ctrl.verifyUserHash, responseMiddleware);
router.post('/verify', ctrl.verfication, responseMiddleware);
router.post('/forgetpassword', ctrl.forgetPassword, responseMiddleware);
router.post('/verifyforgethash', ctrl.verifyForgetHash, responseMiddleware);
router.post('/resetpassword', ctrl.resetPassword, responseMiddleware);
// router.post('/sociallogin', ctrl.socialLogin);

export default {
  path: prefix,
  router,
};


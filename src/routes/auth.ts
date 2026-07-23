import { Router } from 'express';
import config from '../config/index';
import ctrl from '../controllers/users';
import responseMiddleware from '../middlewares/response';

let prefix =  `${config.api.baseURL}/auth`;

const router = Router();
router.post('/login', ctrl.login, responseMiddleware);
router.post('/signup', ctrl.signUp, responseMiddleware);
router.post('/verifyuserhash', ctrl.verifyUserHash);
router.post('/verify', ctrl.verfication, responseMiddleware);
router.post('/forgetpassword', ctrl.forgetPassword);
router.post('/verifyforgethash', ctrl.verifyForgetHash);
router.post('/resetpassword', ctrl.resetPassword);
// router.post('/sociallogin', ctrl.socialLogin);

export default {
  path: prefix,
  router,
};


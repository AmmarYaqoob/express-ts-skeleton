import { Router } from 'express';
import ping from './ping';
import auth from './auth';
const router = Router();

const routes = [
    ping,
    auth,
];

routes.forEach((route) => {
    router.use(route.path, route.router);
});

export default router;

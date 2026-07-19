import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';

import routes from './routes/index';
import errorMiddleware from './middlewares/error';
import notFoundMiddleware from './middlewares/notfound';

const app = express();
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);
app.use(notFoundMiddleware);
app.use(errorMiddleware);
export default app;
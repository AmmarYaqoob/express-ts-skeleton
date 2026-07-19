import { Request, Response, NextFunction } from 'express';
import asyncHandler from '../middlewares/asynchandler'

class PingController {
  public ping = asyncHandler(
    async (
      req: Request,
      res: Response,
      next: NextFunction,
    ) => {
      res.locals.data = `pong!`;
      next();
    },
  );
}

export default new PingController();

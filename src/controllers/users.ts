import { Request, Response, NextFunction } from 'express';
import asyncHandler from '../middlewares/asynchandler'
import userService from '../services/users'

class UserController {
  public login = asyncHandler(
    async (
      req: Request,
      res: Response,
      next: NextFunction,
    ) => {
      res.locals.data = `login`;
      next();
    },
  );

  getUsers = asyncHandler(async (req, res, next) => {
    res.locals.data = await userService.getUsers();
    next();
  });

}

export default new UserController();

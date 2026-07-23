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
      res.locals.data = userService.login;
      next();
    },
  );

  public signUp = asyncHandler(
    async (
      req: Request,
      res: Response,
      next: NextFunction,
    ) => {
      res.locals.data = userService.signUp;
      next();
    },
  );

  public verifyUserHash = asyncHandler(
    async (
      req: Request,
      res: Response,
      next: NextFunction,
    ) => {
      res.locals.data = userService.verifyUserHash;
      next();
    },
  );

  public verfication = asyncHandler(
    async (
      req: Request,
      res: Response,
      next: NextFunction,
    ) => {
      res.locals.data = userService.verfication;
      next();
    },
  );

  public forgetPassword = asyncHandler(
    async (
      req: Request,
      res: Response,
      next: NextFunction,
    ) => {
      res.locals.data = userService.forgetPassword;
      next();
    },
  );

  public verifyForgetHash = asyncHandler(
    async (
      req: Request,
      res: Response,
      next: NextFunction,
    ) => {
      res.locals.data = userService.verifyForgetHash;
      next();
    },
  );

  public resetPassword = asyncHandler(
    async (
      req: Request,
      res: Response,
      next: NextFunction,
    ) => {
      res.locals.data = userService.resetPassword;
      next();
    },
  );

  getAll = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    res.locals.data = await userService.getAll();
    next();
  });

  getById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    res.locals.data = await userService.getById(req.params.id as string);
    next();
  });

  create = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    res.locals.data = await userService.create(req.body);
    res.status(201);
    next();
  });

  update = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    res.locals.data = await userService.update(req.params.id as string, req.body);
    next();
  });

  delete = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    await userService.delete(req.params.id as string);

    res.locals.data = {
      message: 'User deleted successfully',
    };

    next();
  });

  // getUsers = asyncHandler(async (req, res, next) => {
  //   res.locals.data = await userService.getUsers();
  //   next();
  // });
}

export default new UserController();




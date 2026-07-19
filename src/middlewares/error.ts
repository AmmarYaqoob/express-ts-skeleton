import { NextFunction, Request, Response } from 'express';
import AppError from './apperror';
import HttpResponse from './httpresponse';

export default function errorMiddleware(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (err instanceof AppError) {
    return res
      .status(err.statusCode)
      .json(HttpResponse.error(err.message));
  }

  console.error(err);

  return res
    .status(500)
    .json(HttpResponse.error('Internal Server Error'));
}
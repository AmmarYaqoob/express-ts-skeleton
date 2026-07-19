import { Request, Response } from 'express';
import HttpResponse from './httpresponse';

export default function notFoundMiddleware(
  req: Request,
  res: Response,
) {
  res
    .status(404)
    .json(
      HttpResponse.error('Route not found')
    );
}
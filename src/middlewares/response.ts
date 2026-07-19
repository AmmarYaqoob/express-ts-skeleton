import { Request, Response } from 'express';
import HttpResponse from './httpresponse';

export default function responseMiddleware(
    req: Request,
    res: Response
) {
    res.status(200).json(
        HttpResponse.success(res.locals.data)
    );
}
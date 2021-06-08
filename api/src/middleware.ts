import { NextFunction, Request, Response } from 'express';
import { UserToken } from './types';
import jwt from 'jsonwebtoken';

const secret = '5tr0n6P@55W0rD';

export function requireLogin(req: Request, res: Response, next: NextFunction) {
    let accessToken = req.cookies.authorization;

    // if there is no token stored in cookies, the request is unauthorized
    if (!accessToken) {
        return res.sendStatus(401);
    } else {
        try {
            // use the jwt.verify method to verify the access token, itthrows an error if the token has expired or has a invalid signature
            const payload = jwt.verify(accessToken, secret) as UserToken;

            // @ts-ignore
            req.user = payload;
        } catch (e) {
            console.error(e);
            //if an error occured return request unauthorized error, or redirect to login
            return res.sendStatus(401);
        }
    }

    return next();
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
    // @ts-ignore
    if (!req.user || req.user.role !== 'admin') {
        return res.sendStatus(401);
    }
    return next();
}

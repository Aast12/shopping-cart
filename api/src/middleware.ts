import { NextFunction, Request, Response } from 'express';
import { UserToken } from './types';
import jwt from 'jsonwebtoken'

const secret = '5tr0n6P@55W0rD';

// middleware that add the user
export function requireLogin(req: Request, _: Response, next: NextFunction) {
    let accessToken = req.cookies.authorization;
    // if there is no token stored in cookies, the request is unauthorized
    if (!accessToken) {
        console.log('Unauthorized user, redirecting to login');
        // return res.redirect('/login');
        next();
    }

    try {
        // use the jwt.verify method to verify the access token, itthrows an error if the token has expired or has a invalid signature
        const payload = jwt.verify(accessToken, secret) as UserToken;

        console.log('Logged user accessing the site ' + payload.email);
        // @ts-ignore
        req.user = payload; // you can retrieve further details from the database. Here I am just taking the name to render it wherever it is needed.
    } catch (e) {
        console.error(e);
        //if an error occured return request unauthorized error, or redirect to login
        // return res.status(401).send():
        // res.redirect(403, '/login');
    }
    next();
}

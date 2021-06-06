// import { DocumentType } from '@typegoose/typegoose';
// import { User } from './models/User';
import { UserToken } from './types';

declare namespace Express {
    export interface Request {
        user?: UserToken;
    }
}

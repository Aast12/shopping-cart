import { UserToken } from './types';

declare global {
    namespace Express {
        interface Request {
            user?: UserToken;
        }
    }
}

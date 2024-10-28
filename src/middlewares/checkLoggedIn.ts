import { Request, Response, NextFunction } from 'express';
import debug from "debug";


const logger = debug('myapp:server');

/**
 * Middleware za provjeru je li korisnik prijavljen
 */
const checkLoggedIn = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
        return next();
    } else {
        const returnTo = req.originalUrl;
        logger('Korisnik nije prijavljen. Postavlja cookie returnTo:', returnTo);
        res.cookie('returnTo', returnTo, { httpOnly: true, secure: false });
        res.redirect('/login');
    }
};


export default checkLoggedIn;

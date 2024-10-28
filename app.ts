import express, { Application } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import passport from 'passport';
import { Strategy as Auth0Strategy } from 'passport-auth0';
import session from 'express-session';
import indexRouter from './src/routes';
import ticketsRouter from './src/routes/tickets';
import debug from "debug";

const app: Application = express();

//Passport Auth0 strategija
const auth0Strategy = new Auth0Strategy(
    {
        domain: process.env.AUTH0_DOMAIN as string,
        clientID: process.env.AUTH0_CLIENT_ID as string,
        clientSecret: process.env.AUTH0_CLIENT_SECRET as string,
        callbackURL: process.env.AUTH0_CALLBACK_URL as string,
    },
    (accessToken, refreshToken, extraParams, profile, done) => {
        return done(null, profile);
    }
);

passport.use(auth0Strategy);
passport.serializeUser((user, done) => done(null, user));
// @ts-ignore
passport.deserializeUser((user, done) => done(null, user));

// view engine
app.set('views', path.join(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(
    session({
        secret: 'neki-super-1402-jak-tajni-kljuc',
        resave: false,
        saveUninitialized: false,
    })
);
app.use(passport.initialize());
app.use(passport.session());

app.get('/login', passport.authenticate('auth0', { scope: 'openid profile email' }));
app.get(
    '/callback',
    passport.authenticate('auth0', { failureRedirect: '/' }),
    (req, res) => {
        const logger = debug('myapp:server');

        const returnTo = req.cookies.returnTo || '/';
        res.clearCookie('returnTo');

        logger('Redirecting to:', returnTo);
        res.redirect(returnTo);
    }
);
app.get('/logout', (req, res) => {
    req.logout(() => {
        res.redirect('/');
    });
});

app.use('/', indexRouter);
app.use('/tickets', ticketsRouter);

app.use(express.static(path.join(__dirname, 'public')));

export default app;

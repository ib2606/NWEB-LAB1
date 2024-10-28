import 'express-session';

declare module 'express-session' {
    interface Session {
        returnTo?: string;
        returnToTemp?: string;
    }
}

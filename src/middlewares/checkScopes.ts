import { Request, Response, NextFunction } from 'express';

/**
 * Middleware za provjeru scopeova u JWT tokenu
 * @param requiredScopes Lista scopeova koji su potrebni za ovu rutu
 */
const checkScopes = (requiredScopes: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const userScopes = req.auth?.scope?.split(' ') || [];

        const hasRequiredScopes = requiredScopes.every(scope =>
            userScopes.includes(scope)
        );

        if (!hasRequiredScopes) {
            return res.status(403).json({ error: 'Forbidden: Nedostaju odgovarajući scopeovi' });
        }

        next();
    };
};

export default checkScopes;

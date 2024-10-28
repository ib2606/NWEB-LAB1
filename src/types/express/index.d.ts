import express from 'express';

declare global {
    namespace Express {
        interface Request {
            auth?: {
                scope?: string;
                [key: string]: any;
            };
        }
    }
}

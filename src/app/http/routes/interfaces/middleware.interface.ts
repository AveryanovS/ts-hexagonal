import { NextFunction, Response } from 'express';

export interface MiddlewareInterface {
    exec(req: unknown, res?: Response, next?: NextFunction): Promise<unknown>;
}

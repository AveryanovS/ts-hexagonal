import { NextFunction, Response } from 'express';
import { unauthorized } from '@hapi/boom';
import { MiddlewareInterface } from '../interfaces/middleware.interface';
import { AuthUsecase } from '../../../domain/usecases/users/auth.usecase';
import { ERRORS } from '../../../errors';
import { UserRequestInterface } from '../interfaces/userRequest.interface';

export class AuthMiddleware implements MiddlewareInterface {
    constructor(
        private authUsecase: AuthUsecase,
    ) {
    }

    async exec(req: UserRequestInterface, _res: Response, next: NextFunction): Promise<void> {
        const token = String(req.headers['x-access-token']);
        if (!token) { return next(unauthorized(ERRORS.ACCESS_TOKEN_REQUIRED)); }
        req.user = (await this.authUsecase.exec({ token })).data;
        return next();
    }
}
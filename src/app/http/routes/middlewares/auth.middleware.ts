import { NextFunction, Response } from 'express';
import { unauthorized } from '@hapi/boom';
import { inject, injectable } from 'inversify';
import { MiddlewareInterface } from '../interfaces/middleware.interface';
import { AuthUsecase } from '../../../../domain/usecases/users/auth.usecase';
import { ERRORS } from '../../../../errors';
import { UserRequestInterface } from '../interfaces/userRequest.interface';

@injectable()
export class AuthMiddleware implements MiddlewareInterface {
    constructor(
        @inject(AuthUsecase) private authUsecase: AuthUsecase,
    ) {
    }

    async exec(req: UserRequestInterface, _res: Response, next: NextFunction): Promise<void> {
        const token = req.headers['x-access-token'];
        if (!token) { return next(unauthorized(ERRORS.ACCESS_TOKEN_REQUIRED)); }
        req.user = (await this.authUsecase.exec({
            token: String(token),
        })).data;
        return next();
    }
}

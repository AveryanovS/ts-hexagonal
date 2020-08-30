import { Request } from 'express';
import { injectable } from 'inversify';
import { validate } from '../validation/login.validator';
import { LoginUsecase } from '../../../../domain/usecases/users/login.usecase';
import { MiddlewareInterface } from '../../interfaces/middleware.interface';

@injectable()
export class LoginMiddleware implements MiddlewareInterface {
    constructor(
        private usecase: LoginUsecase,
    ) { }

    exec(req: Request): Promise<any> {
        const data = validate(req.body);
        return this.usecase.exec(data);
    }
}
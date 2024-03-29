import { inject, injectable } from 'inversify';
import { InfoUsecase } from '../../../../../domain/usecases/users/info.usecase';
import { MiddlewareInterface } from '../../interfaces/middleware.interface';
import { UserRequestInterface } from '../../interfaces/userRequest.interface';

@injectable()
export class SelfInfoMiddleware implements MiddlewareInterface {
    constructor(
        @inject(InfoUsecase) private infoUsecase: InfoUsecase,
    ) {
    }

    exec(req: UserRequestInterface): Promise<unknown> {
        return this.infoUsecase.exec({
            userId: req.user.id,
        });
    }
}

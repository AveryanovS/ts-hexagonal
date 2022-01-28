import { inject, injectable } from 'inversify';
import { RouterAbstract } from '../router.abstract';
import { LoginMiddleware } from './middlewares/login.middleware';
import { SelfInfoMiddleware } from './middlewares/selfInfo.middleware';
import { AuthMiddleware } from '../middlewares/auth.middleware';

@injectable()
export class UsersRouter extends RouterAbstract {
    constructor(
    @inject(LoginMiddleware) loginMiddleware: LoginMiddleware,
        @inject(SelfInfoMiddleware) selfInfoMiddleware: SelfInfoMiddleware,
        @inject(AuthMiddleware) authMiddleware: AuthMiddleware,
    ) {
        super();

        this.get('/', selfInfoMiddleware, authMiddleware);
        this.post('/login', loginMiddleware);
    }
}

import { injectable } from 'inversify';
import { RouterAbstract } from '../router.abstract';
import { LoginMiddleware } from './middlewares/login.middleware';
import { SelfInfoMiddleware } from './middlewares/selfInfo.middleware';
import { AuthMiddleware } from '../middlewares/auth.middleware';

@injectable()
export class UsersRouter extends RouterAbstract {
    constructor(
        private loginMiddleware: LoginMiddleware,
        private selfInfoMiddleware: SelfInfoMiddleware,
        private auth: AuthMiddleware,
    ) {
        super();

        this.get('/', selfInfoMiddleware, auth.exec);
        this.post('/login', loginMiddleware);
    }
}

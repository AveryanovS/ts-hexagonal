import { inject, injectable } from 'inversify';
import { RouterAbstract } from './router.abstract';
import { UsersRouter } from './users/users.router';

@injectable()
export class RootRouter extends RouterAbstract {
    constructor(
    @inject(UsersRouter) usersRouter: UsersRouter,
    ) {
        super();

        this.addRouter('/users', usersRouter);
    }
}

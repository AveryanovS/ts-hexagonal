import { inject, injectable } from 'inversify';
import { ResultInterface, UsecaseInterface } from '../usecase.interface';
import { UserEntity } from '../../entities/user.entity';
import { TokenService } from '../../ports/token.service';
import { UserService } from '../../ports/user.service';
import { TYPES } from '../../../types';

interface Data {
    token: string,
}
interface Result extends ResultInterface {
    data: UserEntity
}

@injectable()
export class AuthUsecase implements UsecaseInterface<Data, unknown> {
    constructor(
        @inject(TYPES.UserService) private userService: UserService,
        @inject(TYPES.TokenService) private tokenService: TokenService,
    ) {
    }

    async exec(data: Data): Promise<ResultInterface> {
        const { id } = await this.tokenService.verify(data.token);
        const user = await this.userService.findOne({ id });
        return {
            data: user,
            meta: {},
        };
    }
}

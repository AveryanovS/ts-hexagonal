import { ResultInterface, UsecaseInterface } from '../usecase.interface';
import { UserEntity } from '../../entities/user.entity';
import { TokenService } from '../../ports/token.service';
import { UserService } from '../../ports/user.service';

interface Data {
    token: string,
}
interface Result extends ResultInterface {
    data: UserEntity
}
export class AuthUsecase implements UsecaseInterface<Data, unknown> {
    constructor(
        private tokenService: TokenService,
        private userService: UserService,
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

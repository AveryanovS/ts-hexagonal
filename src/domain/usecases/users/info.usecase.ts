import { ResultInterface, UsecaseInterface } from '../usecase.interface';
import { UserEntity } from '../../entities/user.entity';
import { UserService } from '../../ports/user.service';

interface Data {
    userId: string,
}

interface Result extends ResultInterface {
    data: UserEntity,
}
export class InfoUsecase implements UsecaseInterface<Data, unknown> {
    constructor(
        private userService: UserService,
    ) {
    }

    async exec(data: Data): Promise<Result> {
        const user = await this.userService.findOne({
            id: data.userId,
        });
        return {
            data: user,
            meta: {},
        };
    }
}

import { inject, injectable } from 'inversify';
import { ResultInterface, UsecaseInterface } from '../usecase.interface';
import { UserEntity } from '../../entities/user.entity';
import { UserService } from '../../ports/user.service';
import { TYPES } from '../../../types';

interface Data {
    userId: string,
}

interface Result extends ResultInterface {
    data: UserEntity,
}

@injectable()
export class InfoUsecase implements UsecaseInterface<Data, unknown> {
    constructor(
        @inject(TYPES.UserService) private userService: UserService,
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

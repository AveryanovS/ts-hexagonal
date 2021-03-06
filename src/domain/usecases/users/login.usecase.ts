import { inject, injectable } from 'inversify';
import { notFound } from '@hapi/boom';
import { ResultInterface, UsecaseInterface } from '../usecase.interface';
import { OauthService } from '../../ports/oauth.service';
import { UserService } from '../../ports/user.service';
import { UserEntity } from '../../entities/user.entity';
import { TokenService } from '../../ports/token.service';
import { TYPES } from '../../../types';
import { Logger } from '../../../infrastructure/logger/logger';
import { ERRORS } from '../../../errors';

interface Data {
    accessToken: string
}

interface Result extends ResultInterface {
    data: {
        token: string,
    }
}

@injectable()
export class LoginUsecase implements UsecaseInterface<Data, unknown> {
    constructor(
        @inject(TYPES.OauthService) private oauthService: OauthService,
        @inject(TYPES.UserService) private userService: UserService,
        @inject(TYPES.TokenService) private tokenService: TokenService,
        @inject(Logger) private logger: Logger,
    ) {}

    async exec(data: Data): Promise<Result> {
        const userInfo = await this.oauthService.getUserInfo(data.accessToken)
            .catch((error) => {
                this.logger.error(error);
                throw notFound(ERRORS.USER_NOT_FOUND);
            });

        let user: UserEntity | null = null;

        const foundUser = await this.userService.findOne({ oauthSub: userInfo.sub })
            .catch(() => {});
        if (foundUser) user = foundUser;

        if (!user) {
            user = await this.userService.create({
                name: userInfo.name,
                oauthSub: userInfo.sub,
                email: userInfo.email,
            });
        }
        const token = await this.tokenService.sign({
            id: user.id,
        });

        return {
            data: { token },
            meta: {},
        };
    }
}

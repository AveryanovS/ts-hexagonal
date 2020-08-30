import { OAuth2Client } from 'google-auth-library';
import { notFound } from '@hapi/boom';
import { inject, injectable } from 'inversify';
import { OauthService, UserInfo } from '../../domain/ports/oauth.service';
import { Config } from '../../config/config';
import { ERRORS } from '../../errors';

@injectable()
export class OauthServiceImpl implements OauthService {
    private readonly client: OAuth2Client;

    private readonly clientId: string;

    constructor(
    @inject(Config) config: Config,
    ) {
        this.clientId = config.oauthClientId;
        this.client = new OAuth2Client(config.oauthClientId);
    }

    async getUserInfo(accessToken: string): Promise<UserInfo> {
        const ticket = await this.client.verifyIdToken({
            idToken: accessToken,
            audience: this.clientId,
        });
        const payload = await ticket.getPayload();
        if (!payload) throw notFound(ERRORS.USER_NOT_FOUND);
        if (!payload.name || !payload.email || !payload.sub) throw notFound(ERRORS.USER_NOT_FOUND);
        return {
            name: payload.name,
            email: payload.email,
            sub: payload.sub,
        };
    }
}

import jwt from 'jsonwebtoken';
import { inject, injectable } from 'inversify';
import { unauthorized } from '@hapi/boom';
import { TokenService } from '../../domain/ports/token.service';
import { Config } from '../../config/config';
import { ERRORS } from '../../errors';

@injectable()
export class TokenServiceImpl implements TokenService {
    private readonly jwtKey: string;

    constructor(
    @inject(Config) config: Config,
    ) {
        this.jwtKey = config.jwtKey;
    }

    async sign(data: { id: string }): Promise<string> {
        const token = jwt.sign(data, this.jwtKey);
        return token;
    }

    async verify(token: string): Promise<{ id: string }> {
        try {
            const payload: any = jwt.verify(token, this.jwtKey);
            return {
                id: payload.id,
            };
        } catch (error) {
            throw unauthorized(ERRORS.INVALID_TOKEN);
        }
    }
}

import jwt from 'jsonwebtoken';
import { inject, injectable } from 'inversify';
import { TokenService } from '../../domain/ports/token.service';
import { Config } from '../../config/config';

@injectable()
export class TokenServiceImpl implements TokenService {
    private readonly jwtKey: string;

    constructor(
    @inject(Config) config: Config,

    ) {
        this.jwtKey = config.jwtKey;
    }

    async sign(data: { id: string }): Promise<string> {
        const token = await jwt.sign(data, this.jwtKey);
        return token;
    }

    async verify(token: string): Promise<{ id: string }> {
        const payload:any = await jwt.verify(token, this.jwtKey);
        return {
            id: payload.id,
        };
    }
}

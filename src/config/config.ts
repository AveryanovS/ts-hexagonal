import { injectable } from 'inversify';

const {
    NODE_ENV,
    OAUTH_ID,
} = process.env;

@injectable()
class Config {
    constructor(
        public dbUri: string = 'mongodb://127.0.0.1:27017',
        public dbName: string = `${'db'}${NODE_ENV === 'test' ? '_test' : ''}`,
        public jwtKey: string = '1234567890',
        public port: number = 1333,
        public oauthClientId: string = OAUTH_ID || '',
    ) {
    }
}

export { Config };

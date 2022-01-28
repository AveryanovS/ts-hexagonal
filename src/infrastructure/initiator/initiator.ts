import { inject, injectable } from 'inversify';
import { MongoDatabase } from '../db/mongo.db';
import { Initable } from './initable';
import { Logger } from '../logger/logger';

@injectable()
class Initiator {
    private initables: Initable[] = [];

    constructor(
    @inject(MongoDatabase) mongo: MongoDatabase,
        @inject(Logger) private logger: Logger,

    ) {
        this.initables.push(mongo);
    }

    public async initAll(): Promise<number> {
        this.logger.info('[init] started');
        await Promise.all(this.initables.map((i) => i.init()));
        this.logger.info('[init] finished');
        return 0;
    }
}

export { Initiator };

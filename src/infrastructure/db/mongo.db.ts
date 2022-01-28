import mongoose, { Model, Schema, Document } from 'mongoose';
import { inject, injectable } from 'inversify';
import { Config } from '../../config/config';
import { Logger } from '../logger/logger';
import { Initable } from '../initiator/initable';

@injectable()
export class MongoDatabase implements Initable {
    private readonly mongoose: mongoose.Mongoose;

    private readonly connectionString: string;

    constructor(
    @inject(Config) config: Config,
        @inject(Logger) private logger: Logger,
    ) {
        this.mongoose = new mongoose.Mongoose();

        const DB_URI = config.dbUri;
        const DB_NAME = config.dbName;
        this.connectionString = `${DB_URI}/${DB_NAME}`;

        // this.mongoose.connect(connectionString);
        // this.mongoose.connection.on('connected', () => {
        //     logger.info('Connected to mongo db %s', connectionString);
        // });
        // this.mongoose.connection.on('error', (error) => { // TODO: unsafe, remove
        //     logger.error('Mongoose connection error %o', error);
        //     process.exit(1);
        // });
    }

    registerModel<T extends Document>(name: string, schema: Schema): Model<T> {
        return this.mongoose.model<T>(name, schema);
    }

    getMongoose(): mongoose.Mongoose {
        return this.mongoose;
    }

    async init(): Promise<number> {
        this.logger.info('[mongo] Connecting %s', this.connectionString);
        await this.mongoose.connect(this.connectionString);
        this.logger.info('[mongo] Connected %s', this.connectionString);
        return 0;
    }
}

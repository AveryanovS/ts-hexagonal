import mongoose, { Model, Schema, Document } from 'mongoose';
import { inject, injectable } from 'inversify';
import { Config } from '../../config/config';
import { Logger } from '../logger/logger';

@injectable()
export class MongoDatabase {
    private readonly mongoose: mongoose.Mongoose;

    constructor(
        @inject(Config) private config: Config,
        @inject(Logger) private logger: Logger,
    ) {
        this.mongoose = new mongoose.Mongoose();

        const DB_URI = config.dbUri;
        const DB_NAME = config.dbName;
        const connectionString = `${DB_URI}/${DB_NAME}`;

        this.mongoose.connect(connectionString, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        this.mongoose.set('useCreateIndex', true);
        this.mongoose.connection.on('connected', () => {
            logger.info('Connected to mongo db %s', connectionString);
        });
        this.mongoose.connection.on('error', (error) => {
            logger.error('Mongoose connection error %o', error);
            process.exit(1);
        });
    }

    registerModel<T extends Document>(name: string, schema: Schema): Model<T> {
        return this.mongoose.model<T>(name, schema);
    }

    getMongoose(): mongoose.Mongoose {
        return this.mongoose;
    }
}

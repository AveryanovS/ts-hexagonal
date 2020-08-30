import express, {
    Application, NextFunction, Response, Request,
} from 'express';
import { isBoom, boomify, notFound } from '@hapi/boom';
import cors from 'cors';
import { inject, injectable } from 'inversify';
import { Config } from '../config/config';
import { RootRouter } from './routes/root.router';
import { Logger } from '../infrastructure/logger/logger';
import { ERRORS } from '../errors';

@injectable()
class Server {
    private readonly app: Application;

    constructor(
        @inject(Logger) private logger: Logger,
        @inject(Config) private config: Config,
        @inject(RootRouter) private rootRouter: RootRouter,
    ) {
        this.app = express();

        this.app.use((req, _res, next) => {
            logger.info(req.method, req.url);
            next();
        });

        this.app.use(cors({
            origin: true,
            methods: 'GET,POST,PUT,DELETE,OPTIONS,PATCH',
            allowedHeaders: ['Content-Type', 'x-access-token'],
            optionsSuccessStatus: 200,
        }));

        this.app.use(express.json({ limit: '1mb' }));
        this.app.get('/api/ready', (_req, res) => res.send({}));
        this.app.use('/api', this.rootRouter.getRouter());

        this.app.use((_req, _res, next: NextFunction) => {
            next(notFound(ERRORS.URL_NOT_FOUND));
        });

        this.app.use((err: any, req: Request, res: Response, _next: any) => {
            this.logger.error(new Date(), req.url, err);

            if (!isBoom(err)) {
                err = boomify(err);
                err.message = ERRORS.SERVER_ERROR;
            }
            return res.status(err.output.statusCode).json(err.output.payload);
        });
    }

    async listen(): Promise<string> {
        return new Promise((resolve, _reject) => {
            this.app.listen(this.config.port, () => {
                const listenMessage = `Listening on ${this.config.port} port`;
                this.logger.info(listenMessage);
                resolve(listenMessage);
            });
        });
    }

    getApp(): Application {
        return this.app;
    }
}

export { Server };

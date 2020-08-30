import {
    NextFunction, Router, Response, Request,
} from 'express';
import { injectable } from 'inversify';
import { MiddlewareInterface } from './interfaces/middleware.interface';

type PreMiddleware = (req: any, res: Response, next: NextFunction) => Promise<void>;

function handleError(error: Error, next: NextFunction) {
    return next(error);
}

function handleSuccess(data: unknown, res: Response) {
    return res.status(200).json(data).end();
}

function buildHandler(finalMiddleware: MiddlewareInterface) {
    return async function (req: Request, res: Response, next: NextFunction) {
        finalMiddleware.exec(req)
            .then((data) => handleSuccess(data, res))
            .catch((error) => handleError(error, next));
    };
}

@injectable()
export abstract class RouterAbstract {
    protected constructor(
        protected router: Router = Router(),
    ) {
    }

    get(url: string, finalMiddleware: MiddlewareInterface, ...preMiddlewares: PreMiddleware[]) {
        this.router.get(url, ...preMiddlewares, buildHandler(finalMiddleware));
    }

    post(url: string, finalMiddleware: MiddlewareInterface, ...preMiddlewares: PreMiddleware[]) {
        this.router.post(url, ...preMiddlewares, buildHandler(finalMiddleware));
    }

    put(url: string, finalMiddleware: MiddlewareInterface, ...preMiddlewares: PreMiddleware[]) {
        this.router.put(url, ...preMiddlewares, buildHandler(finalMiddleware));
    }

    delete(
        url: string,
        finalMiddleware: MiddlewareInterface,
        ...preMiddlewares: PreMiddleware[]
    ) {
        this.router.delete(url, ...preMiddlewares, buildHandler(finalMiddleware));
    }

    patch(
        url: string,
        finalMiddleware: MiddlewareInterface,
        ...preMiddlewares: PreMiddleware[]
    ) {
        this.router.patch(url, ...preMiddlewares, buildHandler(finalMiddleware));
    }

    addRouter(url: string, router: RouterAbstract) {
        this.router.use(url, router.getRouter());
    }

    getRouter() {
        return this.router;
    }
}

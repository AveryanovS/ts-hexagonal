import {
    NextFunction, Router, Response, Request,
} from 'express';
import { injectable } from 'inversify';
import { MiddlewareInterface } from './interfaces/middleware.interface';

function handleError(error: Error, next: NextFunction) {
    return next(error);
}

function handleSuccess(data: unknown, res: Response) {
    return res.status(200).json(data).end();
}

function buildHandler(finalMiddleware: MiddlewareInterface) {
    return function (req: Request, res: Response, next: NextFunction) {
        finalMiddleware.exec(req)
            .then((data) => handleSuccess(data, res))
            .catch((error) => handleError(error, next));
    };
}

function buildPreHandler(middleware: MiddlewareInterface) {
    return function (req: Request, res: Response, next: NextFunction) {
        return middleware.exec(req, res, next)
            .catch(next);
    };
}
@injectable()
export abstract class RouterAbstract {
    protected constructor(
        protected router: Router = Router(),
    ) {
    }

    get(
        url: string,
        finalMiddleware: MiddlewareInterface,
        ...preMiddlewares: MiddlewareInterface[]
    ) {
        this.router.get(
            url,
            ...(preMiddlewares.map((e) => buildPreHandler(e))),
            buildHandler(finalMiddleware),
        );
    }

    post(
        url: string,
        finalMiddleware: MiddlewareInterface,
        ...preMiddlewares: MiddlewareInterface[]
    ) {
        this.router.post(
            url,
            ...(preMiddlewares.map((e) => buildPreHandler(e))),
            buildHandler(finalMiddleware),
        );
    }

    addRouter(url: string, router: RouterAbstract) {
        this.router.use(url, router.getRouter());
    }

    getRouter() {
        return this.router;
    }
}

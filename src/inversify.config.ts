import { Container } from 'inversify';
import { HttpServer } from './app/http/server';
import { Logger } from './infrastructure/logger/logger';
import { LoginUsecase } from './domain/usecases/users/login.usecase';
import { AuthUsecase } from './domain/usecases/users/auth.usecase';
import { InfoUsecase } from './domain/usecases/users/info.usecase';
import { OauthService } from './domain/ports/oauth.service';
import { TYPES } from './types';
import { TokenService } from './domain/ports/token.service';
import { UserService } from './domain/ports/user.service';
import { TokenServiceImpl } from './infrastructure/services/token.service.impl';
import { UserServiceImpl } from './infrastructure/services/user.service.impl';
import { OauthServiceImpl } from './infrastructure/services/oauth.service.impl';
import { Config } from './config/config';
import { RootRouter } from './app/http/routes/root.router';
import { UsersRouter } from './app/http/routes/users/users.router';
import { AuthMiddleware } from './app/http/routes/middlewares/auth.middleware';
import { SelfInfoMiddleware } from './app/http/routes/users/middlewares/selfInfo.middleware';
import { LoginMiddleware } from './app/http/routes/users/middlewares/login.middleware';
import { MongoDatabase } from './infrastructure/db/mongo.db';
import { Initiator } from './infrastructure/initiator/initiator';

const container = new Container();

container.bind<Config>(Config).toSelf().inSingletonScope();

container.bind<LoginUsecase>(LoginUsecase).toSelf().inSingletonScope();
container.bind<AuthUsecase>(AuthUsecase).toSelf().inSingletonScope();
container.bind<InfoUsecase>(InfoUsecase).toSelf().inSingletonScope();
container.bind<OauthService>(TYPES.OauthService).to(OauthServiceImpl).inSingletonScope();
container.bind<TokenService>(TYPES.TokenService).to(TokenServiceImpl).inSingletonScope();
container.bind<UserService>(TYPES.UserService).to(UserServiceImpl).inSingletonScope();

container.bind<HttpServer>(HttpServer).toSelf().inSingletonScope();
container.bind<RootRouter>(RootRouter).toSelf().inSingletonScope();
container.bind<UsersRouter>(UsersRouter).toSelf().inSingletonScope();
container.bind<AuthMiddleware>(AuthMiddleware).toSelf().inSingletonScope();
container.bind<SelfInfoMiddleware>(SelfInfoMiddleware).toSelf().inSingletonScope();
container.bind<LoginMiddleware>(LoginMiddleware).toSelf().inSingletonScope();

container.bind<Logger>(Logger).toSelf().inSingletonScope();
container.bind<MongoDatabase>(MongoDatabase).toSelf().inSingletonScope();
container.bind<Initiator>(Initiator).toSelf().inSingletonScope();

export { container };

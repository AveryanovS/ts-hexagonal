import 'reflect-metadata';

import { container } from './inversify.config';
import { Server } from './app/server';

const server = container.get<Server>(Server);
server.listen();

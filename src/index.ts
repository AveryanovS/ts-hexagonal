import 'reflect-metadata';

import { container } from './inversify.config';
import { HttpServer } from './app/http/server';
import { Initiator } from './infrastructure/initiator/initiator';

const server = container.get<HttpServer>(HttpServer);
const initiator = container.get<Initiator>(Initiator);
initiator
    .initAll()
    .then(() => server.listen())
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

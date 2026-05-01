import fastifyHelmet from '@fastify/helmet';
import sensible from '@fastify/sensible';
import { initServer } from '@ts-rest/fastify';
import Fastify from 'fastify';
import { contract } from './api/contracts';
import { router } from './app/controller';
import { connectCheck } from './infra/db';
import { envCheck } from './infra/env';
import { getEnv } from './infra/env/service';
import { openApi, errorUtil } from './utils';

const app = Fastify({ logger: { level: 'debug' } });
const port = getEnv('PORT');
const host = getEnv('HOST');

const s = initServer();

const start = async () => {
  try {
    await envCheck();
    await connectCheck();

    await app.register(fastifyHelmet);
    await app.register(sensible);

    app.get('/api/openapi', async () => openApi.document);

    s.registerRouter(contract, router, app, {
      requestValidationErrorHandler: errorUtil.requestValidationErrorHandler,
      logInitialization: true,
    });

    await app.listen({ port, host: getEnv('HOST') });
    console.log(`http://${host}:${port}`);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

start();

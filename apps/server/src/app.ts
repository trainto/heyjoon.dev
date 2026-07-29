import Fastify from 'fastify';
import cookiePlugin from './plugins/cookie.js';
import corsPlugin from './plugins/cors.js';
import sessionPlugin from './plugins/session.js';
import { env } from './env.js';
import routes from './routes/index.js';

export function buildApp() {
  const app = Fastify({
    logger: env.IS_PRODUCTION
      ? true
      : {
          transport: {
            target: 'pino-pretty',
            options: { colorize: true },
          },
        },
  });

  app.register(corsPlugin);
  app.register(cookiePlugin);
  app.register(sessionPlugin);
  app.register(routes);

  return app;
}

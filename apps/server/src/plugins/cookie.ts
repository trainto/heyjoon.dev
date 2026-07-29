import cookie from '@fastify/cookie';
import fp from 'fastify-plugin';

export default fp(async (app) => {
  app.register(cookie);
});

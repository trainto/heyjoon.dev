import { FastifyInstance } from 'fastify';
import placesRoutes from './places/index.js';
import bpRoutes from './bp/index.js';
import githubRoutes from './github/index.js';

export default async function routes(app: FastifyInstance) {
  app.register(placesRoutes, { prefix: '/places' });
  app.register(bpRoutes, { prefix: '/bp' });
  app.register(githubRoutes, { prefix: '/github' });
}

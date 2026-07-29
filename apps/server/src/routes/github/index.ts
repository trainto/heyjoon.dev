import { FastifyInstance } from 'fastify';

export default async function githubRoutes(app: FastifyInstance) {
  app.get('/pr', async () => {
    // GET /github/pr
  });
}

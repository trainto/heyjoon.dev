import { FastifyInstance } from 'fastify';

export default async function commentsRoutes(app: FastifyInstance) {
  app.get('/:placeId', async () => {
    // GET /places/comments/:placeId
  });

  app.post('/:placeId', async () => {
    // POST /places/comments/:placeId
  });
}

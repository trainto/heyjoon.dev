import { FastifyInstance } from 'fastify';

export default async function likesRoutes(app: FastifyInstance) {
  app.get('/:placeId', async () => {
    // GET /places/likes/:placeId
  });

  app.post('/:placeId', async () => {
    // POST /places/likes/:placeId
  });

  app.delete('/:placeId', async () => {
    // DELETE /places/likes/:placeId
  });
}

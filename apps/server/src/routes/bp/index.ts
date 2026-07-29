import { FastifyInstance } from 'fastify';

export default async function bpRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    // GET /bp
  });

  app.post('/', async () => {
    // POST /bp
  });

  app.delete('/:id', async () => {
    // DELETE /bp/:id
  });
}

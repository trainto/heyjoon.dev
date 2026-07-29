import { FastifyInstance } from 'fastify';

export default async function usersRoutes(app: FastifyInstance) {
  app.get('/me', async () => {
    // GET /places/users/me
  });

  app.patch('/me', async () => {
    // PATCH /places/users/me
  });

  app.put('/avatar', async () => {
    // PUT /places/users/avatar
  });

  app.get('/:email', async () => {
    // GET /places/users/:email
  });
}

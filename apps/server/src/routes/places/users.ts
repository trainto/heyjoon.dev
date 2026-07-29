import { eq } from 'drizzle-orm';
import { FastifyInstance } from 'fastify';
import { db } from '../../db.js';
import { users } from '../../schema.js';

export default async function usersRoutes(app: FastifyInstance) {
  app.get('/me', async (req, reply) => {
    if (!req.user) {
      return reply.status(401).send();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { approved, admin, deletedAt, ...safeUser } = req.user;

    return reply.send(safeUser);
  });

  app.patch<{ Body: { intro: string; nickname: string } }>('/me', async (req, reply) => {
    if (!req.user) {
      return reply.status(401).send();
    }

    const { intro, nickname } = req.body;

    if (!intro || !nickname) {
      return reply.status(400).send();
    }

    await db.update(users).set({ intro, nickname }).where(eq(users.email, req.user.email));

    return reply.send();
  });

  app.put('/avatar', async (_req, reply) => {
    // TODO: S3 이미지 업로드 구현 필요
    return reply.status(501).send();
  });

  app.get<{ Params: { email: string } }>('/:email', async (req, reply) => {
    const result = await db.select().from(users).where(eq(users.email, req.params.email)).limit(1);

    if (result.length === 0) {
      return reply.status(404).send();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { admin, approved, deletedAt, ...safeUser } = result[0]!;

    return reply.send(safeUser);
  });
}

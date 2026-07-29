import { and, eq } from 'drizzle-orm';
import { FastifyInstance } from 'fastify';
import { db } from '../../db.js';
import { likes, users } from '../../schema.js';

export default async function likesRoutes(app: FastifyInstance) {
  app.get<{ Params: { placeId: string } }>('/:placeId', async (req, reply) => {
    const placeId = Number(req.params.placeId);

    const result = await db
      .select({
        email: users.email,
        nickname: users.nickname,
        avatar: users.avatar,
        intro: users.intro,
      })
      .from(likes)
      .innerJoin(users, eq(likes.email, users.email))
      .where(eq(likes.place, placeId));

    return reply.send(result);
  });

  app.post<{ Params: { placeId: string } }>('/:placeId', async (req, reply) => {
    if (!req.user) {
      return reply.status(401).send();
    }

    const placeId = Number(req.params.placeId);

    const existing = await db
      .select()
      .from(likes)
      .where(and(eq(likes.place, placeId), eq(likes.email, req.user.email)))
      .limit(1);

    if (existing.length > 0) {
      return reply.status(409).send();
    }

    await db.insert(likes).values({ place: placeId, email: req.user.email });

    return reply.send();
  });

  app.delete<{ Params: { placeId: string } }>('/:placeId', async (req, reply) => {
    if (!req.user) {
      return reply.status(401).send();
    }

    const placeId = Number(req.params.placeId);

    await db
      .delete(likes)
      .where(and(eq(likes.place, placeId), eq(likes.email, req.user.email)));

    return reply.send();
  });
}

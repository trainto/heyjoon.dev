import { asc, eq } from 'drizzle-orm';
import { FastifyInstance } from 'fastify';
import { db } from '../../db.js';
import { comments, users } from '../../schema.js';

export default async function commentsRoutes(app: FastifyInstance) {
  app.get<{ Params: { placeId: string } }>('/:placeId', async (req, reply) => {
    if (!req.user) {
      return reply.status(401).send();
    }

    const placeId = Number(req.params.placeId);

    const result = await db
      .select({
        id: comments.id,
        comment: comments.comment,
        email: comments.email,
        createdAt: comments.createdAt,
        modifiedAt: comments.modifiedAt,
        nickname: users.nickname,
        avatar: users.avatar,
      })
      .from(comments)
      .innerJoin(users, eq(comments.email, users.email))
      .where(eq(comments.place, placeId))
      .orderBy(asc(comments.createdAt));

    return reply.send(result);
  });

  app.post<{ Params: { placeId: string }; Body: { comment: string } }>(
    '/:placeId',
    async (req, reply) => {
      if (!req.user) {
        return reply.status(401).send();
      }

      const { comment } = req.body;
      const placeId = Number(req.params.placeId);

      if (!comment) {
        return reply.status(400).send();
      }

      await db.insert(comments).values({
        comment,
        place: placeId,
        email: req.user.email,
        createdAt: new Date(),
      });

      return reply.status(201).send();
    },
  );
}

import { and, desc, eq, inArray, lt, sql } from 'drizzle-orm';
import { FastifyInstance } from 'fastify';
import { db } from '../../db.js';
import { places, tagRelations, tags, users } from '../../schema.js';
import type { GetPlacesQuery } from '../../types.js';
import adminRoutes from './admin.js';
import authRoutes from './auth.js';
import commentsRoutes from './comments.js';
import likesRoutes from './likes.js';
import tagsRoutes from './tags.js';
import usersRoutes from './users.js';

export default async function placesRoutes(app: FastifyInstance) {
  app.register(authRoutes, { prefix: '/auth' });
  app.register(commentsRoutes, { prefix: '/comments' });
  app.register(likesRoutes, { prefix: '/likes' });
  app.register(tagsRoutes, { prefix: '/tags' });
  app.register(usersRoutes, { prefix: '/users' });
  app.register(adminRoutes, { prefix: '/admin' });

  app.get<{ Querystring: GetPlacesQuery }>('/', async (req, reply) => {
    const lastId = req.query.lastId ? Number(req.query.lastId) : undefined;
    const limit = req.query.limit ? Number(req.query.limit) : 10;
    const tag = req.query.tags ? decodeURIComponent(req.query.tags) : undefined;
    const by = req.query.by ? decodeURIComponent(req.query.by) : undefined;
    const userEmail = req.user?.email;

    const likesCount = sql<number>`(SELECT count(*) FROM Likes l WHERE l.place = ${places.id})`.as('likes');
    const commentsCount = sql<number>`(SELECT count(*) FROM Comments c WHERE c.place = ${places.id})`.as('comments');
    const likedByMe = userEmail
      ? sql<number>`(SELECT count(*) FROM Likes l WHERE l.place = ${places.id} AND l.email = ${userEmail})`.as('likedByMe')
      : sql<number>`0`.as('likedByMe');

    const conditions = [];
    if (lastId) conditions.push(lt(places.id, lastId));
    if (by) conditions.push(eq(places.email, by));

    let query;

    const baseSelect = {
      id: places.id,
      desc: places.desc,
      images: places.images,
      email: places.email,
      createdAt: places.createdAt,
      modifiedAt: places.modifiedAt,
      nickname: users.nickname,
      avatar: users.avatar,
      likes: likesCount,
      likedByMe,
      comments: commentsCount,
    };

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    if (tag) {
      const tagRow = await db.select({ id: tags.id }).from(tags).where(eq(tags.name, tag)).limit(1);

      if (tagRow.length === 0) {
        return reply.send([]);
      }

      query = db
        .select(baseSelect)
        .from(tagRelations)
        .innerJoin(places, eq(places.id, tagRelations.placeId))
        .innerJoin(users, eq(users.email, places.email))
        .where(and(inArray(tagRelations.tagId, [tagRow[0]!.id]), where));
    } else {
      query = db
        .select(baseSelect)
        .from(places)
        .innerJoin(users, eq(users.email, places.email))
        .where(where);
    }

    const rows = await query.orderBy(desc(places.id)).limit(limit);

    return reply.send(rows);
  });

  app.post('/', async () => {
    // POST /places
  });
}

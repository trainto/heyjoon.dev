import { desc, sql } from 'drizzle-orm';
import { FastifyInstance } from 'fastify';
import { db } from '../../db.js';
import { tagRelations, tags } from '../../schema.js';

export default async function tagsRoutes(app: FastifyInstance) {
  app.get<{ Querystring: { limit?: string } }>('/top', async (req, reply) => {
    const limit = req.query.limit ? Number(req.query.limit) : 10;

    const rows = await db
      .select({ name: tags.name })
      .from(tags)
      .innerJoin(tagRelations, sql`${tags.id} = ${tagRelations.tagId}`)
      .groupBy(tags.id)
      .orderBy(desc(sql`count(*)`))
      .limit(limit);

    return reply.send(rows.map((t) => t.name));
  });
}

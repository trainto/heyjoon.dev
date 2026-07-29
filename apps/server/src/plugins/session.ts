import fp from 'fastify-plugin';
import { eq } from 'drizzle-orm';
import { db } from '../db.js';
import { sessions, users } from '../schema.js';
import { env } from '../env.js';

export default fp(async (app) => {
  app.decorateRequest('user', null);

  app.addHook('preHandler', async (req, reply) => {
    const sessionId = req.cookies['session'];
    if (!sessionId) return;

    const result = await db
      .select({ user: users })
      .from(sessions)
      .innerJoin(users, eq(sessions.email, users.email))
      .where(eq(sessions.session, sessionId))
      .limit(1);

    const user = result[0]?.user;

    if (!user || !user.approved) {
      reply.clearCookie('session');
      return;
    }

    req.user = {
      email: user.email,
      nickname: user.nickname,
      avatar: user.avatar ?? '',
      intro: user.intro,
      approved: user.approved,
      admin: user.admin,
      createdAt: user.createdAt.toISOString(),
      deletedAt: user.deletedAt?.toISOString() ?? null,
    };

    await db
      .update(sessions)
      .set({ last: new Date() })
      .where(eq(sessions.session, sessionId));

    const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);

    reply.setCookie('session', sessionId, {
      httpOnly: true,
      secure: true,
      path: env.IS_PRODUCTION ? '/' : '/api',
      domain: env.IS_PRODUCTION ? 'heyjoon.dev' : undefined,
      sameSite: env.IS_PRODUCTION ? 'none' : undefined,
      expires,
    });
  });
});

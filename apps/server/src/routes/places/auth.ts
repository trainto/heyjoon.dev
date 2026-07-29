import { eq } from 'drizzle-orm';
import { FastifyInstance } from 'fastify';
import { db } from '../../db.js';
import { env } from '../../env.js';
import { generateSession, getGoogleUserInfo, sendTelegramMsg } from '../../externals.js';
import { sessions, users } from '../../schema.js';

export default async function authRoutes(app: FastifyInstance) {
  app.post<{ Body: { token: string } }>('/signin-with-google', async (req, reply) => {
    const { token } = req.body;

    if (!token) {
      return reply.status(400).send();
    }

    const googleUser = await getGoogleUserInfo(token);

    if (!googleUser) {
      return reply.status(401).send('Failed to get user info from Google');
    }

    const result = await db.select().from(users).where(eq(users.email, googleUser.email)).limit(1);
    const user = result[0];

    if (!user) {
      await sendTelegramMsg(
        `${googleUser.email} - ${googleUser.name.replace(/\s/g, '')} tried google sign in and is not a member of places now!`,
        env.TELEGRAM_TRAINTO_CHAT_ID
      );

      return reply.status(202).send({
        email: googleUser.email,
        nickname: googleUser.name.replace(/\s/g, ''),
        avatar: googleUser.picture,
      });
    }

    if (!user.approved) {
      return reply.status(202).send();
    }

    const now = new Date();
    const session = generateSession(googleUser.email, now.getTime());

    await db.delete(sessions).where(eq(sessions.email, googleUser.email));
    await db.insert(sessions).values({ session, email: googleUser.email, last: now });

    const expires = new Date(now.getTime() + 1000 * 60 * 60 * 24 * 30);

    reply.setCookie('session', session, {
      httpOnly: true,
      secure: true,
      path: env.IS_PRODUCTION ? '/' : '/api',
      domain: env.IS_PRODUCTION ? 'heyjoon.dev' : undefined,
      sameSite: env.IS_PRODUCTION ? 'none' : undefined,
      expires,
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { approved, admin, deletedAt, ...safeUser } = user;

    return reply.send(safeUser);
  });

  app.post<{ Body: { email: string; nickname: string; avatar?: string; intro?: string } }>(
    '/signup',
    async (req, reply) => {
      const { email, nickname, avatar, intro } = req.body;

      if (!email || !nickname) {
        return reply.status(400).send();
      }

      const existing = await db.select().from(users).where(eq(users.email, email)).limit(1);

      if (existing.length > 0) {
        return reply.status(409).send();
      }

      await db.insert(users).values({
        email,
        nickname: nickname.replace(/\s/g, ''),
        avatar: avatar ?? '',
        intro: intro ?? '',
        approved: 0,
        admin: 0,
        createdAt: new Date(),
      });

      await sendTelegramMsg(
        `Sign up request from ${nickname.replace(/\s/g, '')}`,
        env.TELEGRAM_TRAINTO_CHAT_ID
      );

      return reply.status(201).send();
    }
  );

  app.post('/signout', async (req, reply) => {
    const session = req.cookies['session'];

    if (!session) {
      return reply.status(400).send();
    }

    await db.delete(sessions).where(eq(sessions.session, session));

    reply.clearCookie('session');

    return reply.send();
  });
}

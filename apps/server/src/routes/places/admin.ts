import { eq } from 'drizzle-orm';
import { FastifyInstance } from 'fastify';
import { db } from '../../db.js';
import { users } from '../../schema.js';
import { sendMail } from '../../externals.js';

export default async function adminRoutes(app: FastifyInstance) {
  app.get('/users/waitings', async (req, reply) => {
    if (!req.user?.admin) {
      return reply.status(403).send();
    }

    const waitings = await db.select().from(users).where(eq(users.approved, 0));

    return reply.send(waitings);
  });

  app.post<{ Params: { email: string } }>('/users/approve/:email', async (req, reply) => {
    if (!req.user?.admin) {
      return reply.status(403).send();
    }

    const { email } = req.params;

    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (result.length === 0) {
      return reply.status(404).send();
    }

    await db.update(users).set({ approved: 1 }).where(eq(users.email, email));

    await sendMail(
      email,
      "You've became a member of Places!",
      'Your sign up request has been approved! Please share your places and experience!',
    );

    return reply.send();
  });
}

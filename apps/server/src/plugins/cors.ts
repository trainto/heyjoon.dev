import cors from '@fastify/cors';
import fp from 'fastify-plugin';

export default fp(async (app) => {
  app.register(cors, {
    origin: process.env.IS_PRODUCTION === 'true' ? 'https://heyjoon.dev' : true,
    credentials: true,
    allowedHeaders: ['X-Heyjoon-Time', 'X-Heyjoon-Token', 'Content-Type'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  });
});

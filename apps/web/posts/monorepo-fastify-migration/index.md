---
title: 'Migrating to Monorepo and Replacing Deno with Fastify'
date: '2026-07-29'
description: 'Why I moved this site to a Turborepo monorepo and rewrote the API server from Deno to Fastify with Drizzle ORM'
---

I've been running this site for a while, and the backend was written in Deno. It was a fun experiment at the time — I wanted to try something different from the usual Node.js setup, and Deno's built-in TypeScript support and security model looked appealing.

But as the project grew, a few things started bothering me.

## The Deno problem

First, the ecosystem. Deno has improved a lot, but npm compatibility is still somewhat of an afterthought. I was using `npm:mysql2` with a URL import, pulling in `denomailer` from `deno.land`, and a lightweight S3 client from JSR. Every dependency felt like it lived in a different world.

The other thing was the custom micro-framework I had built. Because Deno doesn't have a framework as dominant as Express or Fastify in the Node.js world (at least not one I was comfortable with), I ended up rolling my own middleware chain. It worked, but it was a lot of code to maintain just to handle cookies, sessions, and body parsing.

I also had some SQL injection vulnerabilities in the `GET /places` query — values like `tags`, `by`, and `lastId` were being interpolated directly into the query string. Not great.

## Why Fastify

I considered Express first, just because it's familiar. But Fastify is faster, has built-in schema validation, and its plugin system is genuinely well-designed. The way scoped plugins work — where decorations and hooks only apply within their registration scope — makes it easy to reason about.

For the ORM, I went with **Drizzle**. I was writing raw SQL before — not because Deno lacks ORM options, just my preference at the time. But raw SQL without any type safety means schema mismatches only show up at runtime. Drizzle gives you typed queries while still feeling close to SQL. No separate schema.prisma file, no Rust engine in the background. The migration was smooth because the mental model is similar to what I was already doing.

## Why a monorepo

The frontend (Next.js) and the API server were in separate repositories. This is fine, but over time it creates friction — switching between repos, keeping shared types in sync, running different dev servers without any coordination.

I used **Turborepo** to pull everything into a monorepo. The setup was simpler than I expected. Turborepo handles caching and task dependencies across packages, so `pnpm build` in the root builds everything in the right order.

The workspace structure ended up like this:

```
apps/
  web/     — Next.js frontend
  server/  — Fastify API
packages/
  eslint-config/
  typescript-config/
```

Shared ESLint and TypeScript configs across both apps means I only configure things once.

## What changed in the API

The endpoint surface is almost the same as before — same routes, same auth flow with Google Sign-In and session cookies. The main differences:

- **SQL injection fixed** — all queries now use parameterized values via Drizzle
- **Drizzle schema** matches the actual DB tables, so type errors catch mismatches at compile time
- **Session handling** is a Fastify plugin instead of middleware in a chain
- **Zod** for environment variable validation — the server fails fast on startup if something is missing, instead of blowing up at runtime

One thing I kept the same on purpose: the session storage. I'm still storing sessions in MySQL instead of using something like Redis or `@fastify/session`. The custom logic (sliding expiry, admin approval state) is specific enough that the extra abstraction would just get in the way.

## Testing

Each route now has unit tests using Vitest and Fastify's `app.inject()`. No real HTTP server needed, no port conflicts. The database is mocked, so tests run fast and don't require a DB connection. The pattern is:

```ts
const app = buildApp()
app.addHook('preHandler', async (req) => { req.user = mockUser })

const res = await app.inject({ method: 'GET', url: '/places/admin/users/waitings' })
expect(res.statusCode).toBe(200)
```

The `buildApp()` factory pattern makes this clean — each test gets a fresh app instance with whatever state it needs injected.

## What's next

One thing I want to add is a shared `packages/types` package. Right now, types like `UserInfo` or the API response shapes are defined separately in both the server and the web app. Since they're in the same repo now, there's no good reason not to share them. A `@repo/types` package would let both apps import from the same source of truth, so a change in the API response shape immediately shows up as a type error in the frontend.

Beyond that, there are a few things I want to explore:

- **Places on a map** — right now places are just listed in a feed. Plotting them on a map would make browsing them a lot more interesting. Probably Kakao Maps or Google Maps with clustered markers.
- **PostgreSQL migration** — MySQL has served fine, but I'd like to try moving to PostgreSQL at some point. Drizzle supports both, so the schema migration wouldn't be too painful. The main reason is just that the PostgreSQL ecosystem (extensions, JSON support, full-text search) is more interesting to work with.
- **Real-time features** — comments and likes currently require a page refresh to update. WebSockets or SSE would make the experience feel more alive, and Fastify has decent support for both.

## Was it worth it

Honestly, yes. The Deno experiment was useful — I learned things I wouldn't have otherwise. But for a project I actually want to maintain long-term, being in the Node.js ecosystem with a proper framework, a well-typed ORM, and everything in one repo makes the day-to-day a lot smoother.

The frontend didn't change much. Next.js static export to GitHub Pages is still the deployment story. The API runs on a VPS behind its own domain. Same as before, just better organized.

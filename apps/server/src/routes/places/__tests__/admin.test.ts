import { beforeEach, describe, expect, it, vi } from 'vitest';
import { buildApp } from '../../../app.js';
import type { UserInfo } from '../../../types.d.ts';

const { mockWhere, mockLimit } = vi.hoisted(() => ({
  mockWhere: vi.fn(),
  mockLimit: vi.fn(),
}));

vi.mock('../../../db.js', () => ({
  db: {
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: mockWhere,
    limit: mockLimit,
    update: vi.fn().mockReturnThis(),
    set: vi.fn().mockReturnThis(),
  },
}));

vi.mock('../../../externals.js', () => ({
  sendMail: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('../../../plugins/session.js', () => ({
  default: vi.fn((app) => {
    app.decorateRequest('user', null);
  }),
}));

const adminUser: UserInfo = {
  email: 'trainto@gmail.com',
  nickname: 'admin',
  avatar: '',
  approved: 1,
  admin: 1,
  createdAt: new Date().toISOString(),
};

function buildTestApp(user: UserInfo | null = null) {
  const app = buildApp();
  app.addHook('preHandler', async (req) => {
    req.user = user;
  });
  return app;
}

describe('GET /places/admin/users/waitings', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockWhere.mockResolvedValue([
      { email: 'user1@test.com', nickname: 'user1', approved: 0 },
      { email: 'user2@test.com', nickname: 'user2', approved: 0 },
    ]);
  });

  it('returns 403 if not logged in', async () => {
    const app = buildTestApp(null);
    const res = await app.inject({
      method: 'GET',
      url: '/places/admin/users/waitings',
    });

    expect(res.statusCode).toBe(403);
  });

  it('returns 403 if user is not admin', async () => {
    const app = buildTestApp({ ...adminUser, admin: 0 });
    const res = await app.inject({
      method: 'GET',
      url: '/places/admin/users/waitings',
    });

    expect(res.statusCode).toBe(403);
  });

  it('returns waiting users list if user is admin', async () => {
    const app = buildTestApp(adminUser);
    const res = await app.inject({
      method: 'GET',
      url: '/places/admin/users/waitings',
    });

    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body).toHaveLength(2);
    expect(body[0]).toMatchObject({ email: 'user1@test.com', approved: 0 });
  });
});

describe('POST /places/admin/users/approve/:email', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockWhere.mockReturnThis();
    mockLimit.mockResolvedValue([
      { email: 'user1@test.com', nickname: 'user1', approved: 0 },
    ]);
  });

  it('returns 403 if not logged in', async () => {
    const app = buildTestApp(null);
    const res = await app.inject({
      method: 'POST',
      url: '/places/admin/users/approve/user1@test.com',
    });

    expect(res.statusCode).toBe(403);
  });

  it('returns 403 if user is not admin', async () => {
    const app = buildTestApp({ ...adminUser, admin: 0 });
    const res = await app.inject({
      method: 'POST',
      url: '/places/admin/users/approve/user1@test.com',
    });

    expect(res.statusCode).toBe(403);
  });

  it('returns 404 if target user does not exist', async () => {
    mockLimit.mockResolvedValueOnce([]);

    const app = buildTestApp(adminUser);
    const res = await app.inject({
      method: 'POST',
      url: '/places/admin/users/approve/notfound@test.com',
    });

    expect(res.statusCode).toBe(404);
  });

  it('approves user and sends mail if admin', async () => {
    const { sendMail } = await import('../../../externals.js');
    const app = buildTestApp(adminUser);
    const res = await app.inject({
      method: 'POST',
      url: '/places/admin/users/approve/user1@test.com',
    });

    expect(res.statusCode).toBe(200);
    expect(sendMail).toHaveBeenCalledWith(
      'user1@test.com',
      expect.any(String),
      expect.any(String),
    );
  });
});

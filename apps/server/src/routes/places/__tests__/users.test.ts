import { beforeEach, describe, expect, it, vi } from 'vitest';
import { buildApp } from '../../../app.js';
import type { UserInfo } from '../../../types.d.ts';

const { mockSelect, mockFrom, mockWhere, mockLimit, mockUpdate, mockSet } = vi.hoisted(() => ({
  mockSelect: vi.fn(),
  mockFrom: vi.fn(),
  mockWhere: vi.fn(),
  mockLimit: vi.fn(),
  mockUpdate: vi.fn(),
  mockSet: vi.fn(),
}));

vi.mock('../../../db.js', () => ({
  db: {
    select: mockSelect.mockReturnThis(),
    from: mockFrom.mockReturnThis(),
    where: mockWhere.mockReturnThis(),
    limit: mockLimit,
    update: mockUpdate.mockReturnThis(),
    set: mockSet.mockReturnThis(),
  },
}));

vi.mock('../../../plugins/session.js', () => ({
  default: vi.fn((app) => {
    app.decorateRequest('user', null);
  }),
}));

const loggedInUser: UserInfo = {
  email: 'user@test.com',
  nickname: 'User',
  avatar: 'avatar.jpg',
  intro: 'hello',
  approved: 1,
  admin: 0,
  createdAt: new Date().toISOString(),
};

function buildTestApp(user: UserInfo | null = null) {
  const app = buildApp();
  app.addHook('preHandler', async (req) => {
    req.user = user;
  });
  return app;
}

describe('GET /places/users/me', () => {
  it('returns 401 if not logged in', async () => {
    const app = buildTestApp(null);
    const res = await app.inject({ method: 'GET', url: '/places/users/me' });

    expect(res.statusCode).toBe(401);
  });

  it('returns user info without sensitive fields', async () => {
    const app = buildTestApp(loggedInUser);
    const res = await app.inject({ method: 'GET', url: '/places/users/me' });

    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body).toMatchObject({ email: loggedInUser.email, nickname: loggedInUser.nickname });
    expect(body).not.toHaveProperty('approved');
    expect(body).not.toHaveProperty('admin');
    expect(body).not.toHaveProperty('deletedAt');
  });
});

describe('PATCH /places/users/me', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUpdate.mockReturnThis();
    mockSet.mockReturnThis();
    mockWhere.mockResolvedValue(undefined);
  });

  it('returns 401 if not logged in', async () => {
    const app = buildTestApp(null);
    const res = await app.inject({
      method: 'PATCH',
      url: '/places/users/me',
      payload: { intro: 'hi', nickname: 'NewName' },
    });

    expect(res.statusCode).toBe(401);
  });

  it('returns 400 if intro or nickname is missing', async () => {
    const app = buildTestApp(loggedInUser);
    const res = await app.inject({
      method: 'PATCH',
      url: '/places/users/me',
      payload: { nickname: 'NewName' },
    });

    expect(res.statusCode).toBe(400);
  });

  it('updates user and returns 200', async () => {
    const app = buildTestApp(loggedInUser);
    const res = await app.inject({
      method: 'PATCH',
      url: '/places/users/me',
      payload: { intro: 'new intro', nickname: 'NewName' },
    });

    expect(res.statusCode).toBe(200);
    expect(mockSet).toHaveBeenCalledWith({ intro: 'new intro', nickname: 'NewName' });
  });
});

describe('GET /places/users/:email', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSelect.mockReturnThis();
    mockFrom.mockReturnThis();
    mockWhere.mockReturnThis();
    mockLimit.mockResolvedValue([
      {
        email: 'user@test.com',
        nickname: 'User',
        avatar: 'avatar.jpg',
        intro: 'hello',
        approved: 1,
        admin: 0,
        createdAt: new Date(),
        deletedAt: null,
      },
    ]);
  });

  it('returns 404 if user not found', async () => {
    mockLimit.mockResolvedValueOnce([]);

    const app = buildTestApp();
    const res = await app.inject({ method: 'GET', url: '/places/users/notfound@test.com' });

    expect(res.statusCode).toBe(404);
  });

  it('returns user info without sensitive fields', async () => {
    const app = buildTestApp();
    const res = await app.inject({ method: 'GET', url: '/places/users/user@test.com' });

    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body).toMatchObject({ email: 'user@test.com', nickname: 'User' });
    expect(body).not.toHaveProperty('admin');
    expect(body).not.toHaveProperty('approved');
    expect(body).not.toHaveProperty('deletedAt');
  });
});

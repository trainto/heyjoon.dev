import { beforeEach, describe, expect, it, vi } from 'vitest';
import { buildApp } from '../../../app.js';
import type { UserInfo } from '../../../types.d.ts';

const { mockSelect, mockFrom, mockInnerJoin, mockWhere, mockOrderBy, mockInsert, mockValues } =
  vi.hoisted(() => ({
    mockSelect: vi.fn(),
    mockFrom: vi.fn(),
    mockInnerJoin: vi.fn(),
    mockWhere: vi.fn(),
    mockOrderBy: vi.fn(),
    mockInsert: vi.fn(),
    mockValues: vi.fn().mockResolvedValue(undefined),
  }));

vi.mock('../../../db.js', () => ({
  db: {
    select: mockSelect.mockReturnThis(),
    from: mockFrom.mockReturnThis(),
    innerJoin: mockInnerJoin.mockReturnThis(),
    where: mockWhere.mockReturnThis(),
    orderBy: mockOrderBy,
    insert: mockInsert.mockReturnThis(),
    values: mockValues,
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

describe('GET /places/comments/:placeId', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSelect.mockReturnThis();
    mockFrom.mockReturnThis();
    mockInnerJoin.mockReturnThis();
    mockWhere.mockReturnThis();
    mockOrderBy.mockResolvedValue([
      { id: 1, comment: 'hello', email: 'user@test.com', nickname: 'User', avatar: 'a.jpg', createdAt: new Date(), modifiedAt: null },
    ]);
  });

  it('returns 401 if not logged in', async () => {
    const app = buildTestApp(null);
    const res = await app.inject({ method: 'GET', url: '/places/comments/1' });

    expect(res.statusCode).toBe(401);
  });

  it('returns comments list if logged in', async () => {
    const app = buildTestApp(loggedInUser);
    const res = await app.inject({ method: 'GET', url: '/places/comments/1' });

    expect(res.statusCode).toBe(200);
    expect(res.json()).toHaveLength(1);
    expect(res.json()[0]).toMatchObject({ comment: 'hello', nickname: 'User' });
  });
});

describe('POST /places/comments/:placeId', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockInsert.mockReturnThis();
    mockValues.mockResolvedValue(undefined);
  });

  it('returns 401 if not logged in', async () => {
    const app = buildTestApp(null);
    const res = await app.inject({
      method: 'POST',
      url: '/places/comments/1',
      payload: { comment: 'hello' },
    });

    expect(res.statusCode).toBe(401);
  });

  it('returns 400 if comment is missing', async () => {
    const app = buildTestApp(loggedInUser);
    const res = await app.inject({
      method: 'POST',
      url: '/places/comments/1',
      payload: {},
    });

    expect(res.statusCode).toBe(400);
  });

  it('inserts comment and returns 201', async () => {
    const app = buildTestApp(loggedInUser);
    const res = await app.inject({
      method: 'POST',
      url: '/places/comments/1',
      payload: { comment: 'hello' },
    });

    expect(res.statusCode).toBe(201);
    expect(mockValues).toHaveBeenCalledWith(
      expect.objectContaining({ comment: 'hello', place: 1, email: loggedInUser.email }),
    );
  });
});

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { buildApp } from '../../../app.js';
import type { UserInfo } from '../../../types.d.ts';

const { mockSelect, mockFrom, mockInnerJoin, mockWhere, mockLimit, mockInsert, mockValues, mockDelete } =
  vi.hoisted(() => ({
    mockSelect: vi.fn(),
    mockFrom: vi.fn(),
    mockInnerJoin: vi.fn(),
    mockWhere: vi.fn(),
    mockLimit: vi.fn(),
    mockInsert: vi.fn(),
    mockValues: vi.fn().mockResolvedValue(undefined),
    mockDelete: vi.fn(),
  }));

vi.mock('../../../db.js', () => ({
  db: {
    select: mockSelect.mockReturnThis(),
    from: mockFrom.mockReturnThis(),
    innerJoin: mockInnerJoin.mockReturnThis(),
    where: mockWhere.mockReturnThis(),
    limit: mockLimit,
    insert: mockInsert.mockReturnThis(),
    values: mockValues,
    delete: mockDelete.mockReturnThis(),
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

describe('GET /places/likes/:placeId', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSelect.mockReturnThis();
    mockFrom.mockReturnThis();
    mockInnerJoin.mockReturnThis();
    mockWhere.mockResolvedValue([
      { email: 'a@test.com', nickname: 'A', avatar: 'a.jpg', intro: null },
    ]);
  });

  it('returns likers list', async () => {
    const app = buildTestApp();
    const res = await app.inject({
      method: 'GET',
      url: '/places/likes/1',
    });

    expect(res.statusCode).toBe(200);
    expect(res.json()).toHaveLength(1);
    expect(res.json()[0]).toMatchObject({ email: 'a@test.com', nickname: 'A' });
  });
});

describe('POST /places/likes/:placeId', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSelect.mockReturnThis();
    mockFrom.mockReturnThis();
    mockWhere.mockReturnThis();
    mockLimit.mockResolvedValue([]);
    mockInsert.mockReturnThis();
    mockValues.mockResolvedValue(undefined);
  });

  it('returns 401 if not logged in', async () => {
    const app = buildTestApp(null);
    const res = await app.inject({
      method: 'POST',
      url: '/places/likes/1',
    });

    expect(res.statusCode).toBe(401);
  });

  it('returns 409 if already liked', async () => {
    mockLimit.mockResolvedValueOnce([{ place: 1, email: 'user@test.com' }]);

    const app = buildTestApp(loggedInUser);
    const res = await app.inject({
      method: 'POST',
      url: '/places/likes/1',
    });

    expect(res.statusCode).toBe(409);
  });

  it('inserts like and returns 200', async () => {
    const app = buildTestApp(loggedInUser);
    const res = await app.inject({
      method: 'POST',
      url: '/places/likes/1',
    });

    expect(res.statusCode).toBe(200);
    expect(mockValues).toHaveBeenCalledWith({ place: 1, email: loggedInUser.email });
  });
});

describe('DELETE /places/likes/:placeId', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockDelete.mockReturnThis();
    mockWhere.mockResolvedValue(undefined);
  });

  it('returns 401 if not logged in', async () => {
    const app = buildTestApp(null);
    const res = await app.inject({
      method: 'DELETE',
      url: '/places/likes/1',
    });

    expect(res.statusCode).toBe(401);
  });

  it('deletes like and returns 200', async () => {
    const app = buildTestApp(loggedInUser);
    const res = await app.inject({
      method: 'DELETE',
      url: '/places/likes/1',
    });

    expect(res.statusCode).toBe(200);
    expect(mockDelete).toHaveBeenCalled();
  });
});

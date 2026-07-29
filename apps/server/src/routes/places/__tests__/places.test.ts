import { beforeEach, describe, expect, it, vi } from 'vitest';
import { buildApp } from '../../../app.js';
import type { UserInfo } from '../../../types.d.ts';

const mockPlaces = [
  {
    id: 2,
    desc: '#서울 #카페',
    images: 'img2.jpg',
    email: 'user@test.com',
    createdAt: new Date(),
    modifiedAt: new Date(),
    nickname: 'User',
    avatar: 'avatar.jpg',
    likes: 3,
    likedByMe: 0,
    comments: 1,
  },
  {
    id: 1,
    desc: '#부산 #맛집',
    images: 'img1.jpg',
    email: 'user@test.com',
    createdAt: new Date(),
    modifiedAt: new Date(),
    nickname: 'User',
    avatar: 'avatar.jpg',
    likes: 0,
    likedByMe: 0,
    comments: 0,
  },
];

const { mockSelect, mockFrom, mockWhere, mockOrderBy, mockLimit, mockInnerJoin } = vi.hoisted(() => ({
  mockSelect: vi.fn(),
  mockFrom: vi.fn(),
  mockWhere: vi.fn(),
  mockOrderBy: vi.fn(),
  mockLimit: vi.fn(),
  mockInnerJoin: vi.fn(),
}));

vi.mock('../../../db.js', () => ({
  db: {
    select: mockSelect.mockReturnThis(),
    from: mockFrom.mockReturnThis(),
    where: mockWhere.mockReturnThis(),
    orderBy: mockOrderBy.mockReturnThis(),
    limit: mockLimit,
    innerJoin: mockInnerJoin.mockReturnThis(),
  },
}));

vi.mock('../../../plugins/session.js', () => ({
  default: vi.fn((app) => {
    app.decorateRequest('user', null);
  }),
}));

const adminUser: UserInfo = {
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

describe('GET /places', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSelect.mockReturnThis();
    mockFrom.mockReturnThis();
    mockWhere.mockReturnThis();
    mockOrderBy.mockReturnThis();
    mockInnerJoin.mockReturnThis();
    mockLimit.mockResolvedValue(mockPlaces);
  });

  it('returns places list with default limit 10', async () => {
    const app = buildTestApp();
    const res = await app.inject({
      method: 'GET',
      url: '/places',
    });

    expect(res.statusCode).toBe(200);
    expect(res.json()).toHaveLength(2);
  });

  it('returns places list when logged in (likedByMe available)', async () => {
    const app = buildTestApp(adminUser);
    const res = await app.inject({
      method: 'GET',
      url: '/places',
    });

    expect(res.statusCode).toBe(200);
    expect(res.json()).toHaveLength(2);
  });

  it('passes lastId as filter condition', async () => {
    const app = buildTestApp();
    const res = await app.inject({
      method: 'GET',
      url: '/places?lastId=10',
    });

    expect(res.statusCode).toBe(200);
  });

  it('passes by as filter condition', async () => {
    const app = buildTestApp();
    const res = await app.inject({
      method: 'GET',
      url: '/places?by=user@test.com',
    });

    expect(res.statusCode).toBe(200);
  });

  it('returns empty array if tag not found', async () => {
    mockLimit.mockResolvedValueOnce([]); // tag 조회 결과 없음

    const app = buildTestApp();
    const res = await app.inject({
      method: 'GET',
      url: '/places?tags=%EC%84%9C%EC%9A%B8',
    });

    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual([]);
  });

  it('returns places filtered by tag', async () => {
    mockLimit.mockResolvedValueOnce([{ id: 5 }]); // tag 조회
    mockLimit.mockResolvedValueOnce(mockPlaces);   // places 조회

    const app = buildTestApp();
    const res = await app.inject({
      method: 'GET',
      url: '/places?tags=%EC%84%9C%EC%9A%B8',
    });

    expect(res.statusCode).toBe(200);
    expect(res.json()).toHaveLength(2);
  });
});

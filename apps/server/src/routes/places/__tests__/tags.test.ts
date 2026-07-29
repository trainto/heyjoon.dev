import { beforeEach, describe, expect, it, vi } from 'vitest';
import { buildApp } from '../../../app.js';

const { mockSelect, mockFrom, mockInnerJoin, mockGroupBy, mockOrderBy, mockLimit } = vi.hoisted(
  () => ({
    mockSelect: vi.fn(),
    mockFrom: vi.fn(),
    mockInnerJoin: vi.fn(),
    mockGroupBy: vi.fn(),
    mockOrderBy: vi.fn(),
    mockLimit: vi.fn(),
  }),
);

vi.mock('../../../db.js', () => ({
  db: {
    select: mockSelect.mockReturnThis(),
    from: mockFrom.mockReturnThis(),
    innerJoin: mockInnerJoin.mockReturnThis(),
    groupBy: mockGroupBy.mockReturnThis(),
    orderBy: mockOrderBy.mockReturnThis(),
    limit: mockLimit,
  },
}));

vi.mock('../../../plugins/session.js', () => ({
  default: vi.fn((app) => {
    app.decorateRequest('user', null);
  }),
}));

describe('GET /places/tags/top', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSelect.mockReturnThis();
    mockFrom.mockReturnThis();
    mockInnerJoin.mockReturnThis();
    mockGroupBy.mockReturnThis();
    mockOrderBy.mockReturnThis();
    mockLimit.mockResolvedValue([{ name: '서울' }, { name: '맛집' }, { name: '카페' }]);
  });

  it('returns top tags as string array', async () => {
    const app = buildApp();
    const res = await app.inject({
      method: 'GET',
      url: '/places/tags/top',
    });

    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual(['서울', '맛집', '카페']);
  });

  it('applies custom limit from query', async () => {
    const app = buildApp();
    const res = await app.inject({
      method: 'GET',
      url: '/places/tags/top?limit=5',
    });

    expect(res.statusCode).toBe(200);
    expect(mockLimit).toHaveBeenCalledWith(5);
  });

  it('uses default limit 10 when not specified', async () => {
    const app = buildApp();
    await app.inject({
      method: 'GET',
      url: '/places/tags/top',
    });

    expect(mockLimit).toHaveBeenCalledWith(10);
  });
});

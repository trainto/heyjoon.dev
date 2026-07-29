import { beforeEach, describe, expect, it, vi } from 'vitest';
import { buildApp } from '../../../app.js';

const { mockWhere, mockLimit, mockDelete, mockInsert, mockValues } = vi.hoisted(() => ({
  mockWhere: vi.fn(),
  mockLimit: vi.fn(),
  mockDelete: vi.fn(),
  mockInsert: vi.fn(),
  mockValues: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('../../../db.js', () => ({
  db: {
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: mockWhere.mockReturnThis(),
    limit: mockLimit,
    delete: mockDelete.mockReturnThis(),
    insert: mockInsert.mockReturnThis(),
    values: mockValues,
  },
}));

vi.mock('../../../externals.js', () => ({
  getGoogleUserInfo: vi.fn(),
  generateSession: vi.fn().mockReturnValue('generated-session-id'),
  sendTelegramMsg: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('../../../plugins/session.js', () => ({
  default: vi.fn((app) => {
    app.decorateRequest('user', null);
  }),
}));

const googleUser = {
  email: 'user@gmail.com',
  name: 'Test User',
  picture: 'https://example.com/avatar.jpg',
};

const dbUser = {
  email: 'user@gmail.com',
  nickname: 'TestUser',
  avatar: 'https://example.com/avatar.jpg',
  intro: null,
  approved: 1,
  admin: 0,
  createdAt: new Date(),
  deletedAt: null,
};

describe('POST /places/auth/signin-with-google', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockWhere.mockReturnThis();
    mockLimit.mockResolvedValue([dbUser]);
  });

  it('returns 400 if token is missing', async () => {
    const app = buildApp();
    const res = await app.inject({
      method: 'POST',
      url: '/places/auth/signin-with-google',
      payload: {},
    });

    expect(res.statusCode).toBe(400);
  });

  it('returns 401 if Google token is invalid', async () => {
    const { getGoogleUserInfo } = await import('../../../externals.js');
    vi.mocked(getGoogleUserInfo).mockResolvedValueOnce(null);

    const app = buildApp();
    const res = await app.inject({
      method: 'POST',
      url: '/places/auth/signin-with-google',
      payload: { token: 'invalid-token' },
    });

    expect(res.statusCode).toBe(401);
  });

  it('returns 202 with user info if not a member yet', async () => {
    const { getGoogleUserInfo } = await import('../../../externals.js');
    vi.mocked(getGoogleUserInfo).mockResolvedValueOnce(googleUser);
    mockLimit.mockResolvedValueOnce([]);

    const app = buildApp();
    const res = await app.inject({
      method: 'POST',
      url: '/places/auth/signin-with-google',
      payload: { token: 'valid-token' },
    });

    expect(res.statusCode).toBe(202);
    expect(res.json()).toMatchObject({ email: googleUser.email });
  });

  it('returns 202 without body if member but not approved', async () => {
    const { getGoogleUserInfo } = await import('../../../externals.js');
    vi.mocked(getGoogleUserInfo).mockResolvedValueOnce(googleUser);
    mockLimit.mockResolvedValueOnce([{ ...dbUser, approved: 0 }]);

    const app = buildApp();
    const res = await app.inject({
      method: 'POST',
      url: '/places/auth/signin-with-google',
      payload: { token: 'valid-token' },
    });

    expect(res.statusCode).toBe(202);
    expect(res.body).toBe('');
  });

  it('creates session and returns user info if approved', async () => {
    const { getGoogleUserInfo } = await import('../../../externals.js');
    vi.mocked(getGoogleUserInfo).mockResolvedValueOnce(googleUser);

    const app = buildApp();
    const res = await app.inject({
      method: 'POST',
      url: '/places/auth/signin-with-google',
      payload: { token: 'valid-token' },
    });

    expect(res.statusCode).toBe(200);
    expect(mockDelete).toHaveBeenCalled();
    expect(mockValues).toHaveBeenCalled();

    const body = res.json();
    expect(body).toMatchObject({ email: dbUser.email, nickname: dbUser.nickname });
    expect(body).not.toHaveProperty('approved');
    expect(body).not.toHaveProperty('admin');
    expect(body).not.toHaveProperty('deletedAt');
    expect(res.headers['set-cookie']).toMatch(/session=/);
  });
});

describe('POST /places/auth/signup', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockWhere.mockReturnThis();
    mockLimit.mockResolvedValue([]);
    mockInsert.mockReturnThis();
    mockValues.mockResolvedValue(undefined);
  });

  it('returns 400 if email is missing', async () => {
    const app = buildApp();
    const res = await app.inject({
      method: 'POST',
      url: '/places/auth/signup',
      payload: { nickname: 'TestUser' },
    });

    expect(res.statusCode).toBe(400);
  });

  it('returns 400 if nickname is missing', async () => {
    const app = buildApp();
    const res = await app.inject({
      method: 'POST',
      url: '/places/auth/signup',
      payload: { email: 'user@gmail.com' },
    });

    expect(res.statusCode).toBe(400);
  });

  it('returns 409 if email already exists', async () => {
    mockLimit.mockResolvedValueOnce([dbUser]);

    const app = buildApp();
    const res = await app.inject({
      method: 'POST',
      url: '/places/auth/signup',
      payload: { email: 'user@gmail.com', nickname: 'TestUser' },
    });

    expect(res.statusCode).toBe(409);
  });

  it('creates user and returns 201', async () => {
    const { sendTelegramMsg } = await import('../../../externals.js');

    const app = buildApp();
    const res = await app.inject({
      method: 'POST',
      url: '/places/auth/signup',
      payload: { email: 'user@gmail.com', nickname: 'Test User', avatar: 'https://avatar.url' },
    });

    expect(res.statusCode).toBe(201);
    expect(mockValues).toHaveBeenCalledWith(
      expect.objectContaining({ email: 'user@gmail.com', nickname: 'TestUser' }),
    );
    expect(sendTelegramMsg).toHaveBeenCalled();
  });
});

describe('POST /places/auth/signout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockDelete.mockReturnThis();
  });

  it('returns 400 if session cookie is missing', async () => {
    const app = buildApp();
    const res = await app.inject({
      method: 'POST',
      url: '/places/auth/signout',
    });

    expect(res.statusCode).toBe(400);
  });

  it('deletes session and clears cookie', async () => {
    mockWhere.mockResolvedValueOnce(undefined);

    const app = buildApp();
    const res = await app.inject({
      method: 'POST',
      url: '/places/auth/signout',
      cookies: { session: 'test-session-id' },
    });

    expect(res.statusCode).toBe(200);
    expect(mockDelete).toHaveBeenCalled();
    expect(res.headers['set-cookie']).toMatch(/session=;/);
  });
});

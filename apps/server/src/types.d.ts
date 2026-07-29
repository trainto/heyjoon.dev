export type UserInfo = {
  email: string;
  nickname: string;
  avatar: string;
  intro?: string | null;
  approved: number;
  admin?: number | null;
  createdAt: string;
  deletedAt?: string | null;
};

export type GetPlacesQuery = {
  lastId?: string;
  limit?: string;
  tags?: string;
  by?: string;
};

declare module 'fastify' {
  interface FastifyRequest {
    user: UserInfo | null;
  }
}

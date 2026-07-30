export type UserInfo = {
  email: string;
  nickname: string;
  avatar: string;
  intro?: string | null;
  approved?: number;
  admin?: number | null;
  createdAt: string;
  deletedAt?: string | null;
};

export type Place = {
  id: number;
  desc: string;
  images: string;
  email: string;
  avatar: string;
  nickname: string;
  createdAt: string;
  modifiedAt: string;
  comments: number;
  likes: number;
  likedByMe?: number;
};

export type CommentInfo = {
  id: number;
  comment: string;
  place: number;
  email: string;
  nickname: string;
  avatar: string;
  createdAt: string;
  modifiedAt?: string | null;
};

export type BP = {
  id: number;
  systolic: number;
  diastolic: number;
  createdAt: string;
};

export type GithubPR = {
  id: number;
  title: string;
  html_url: string;
  repository_url: string;
  created_at: string;
  state: 'open' | 'closed';
  pull_request: {
    merged_at: string | null;
  };
};

export type GetPlacesQuery = {
  lastId?: string;
  limit?: string;
  tags?: string;
  by?: string;
};

type PostType = {
  slug: string;
  title: string;
  date: string;
  description?: string;
  content: string;
};

type Place = {
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

type UserInfo = {
  email: string;
  nickname: string;
  avatar: string;
  intro?: string;
  createdAt: string;
};

type CommentInfo = {
  id: number;
  comment: string;
  place: number;
  email: string;
  nickname: string;
  avatar: string;
  createdAt: string;
  modifiedAt?: string;
};

type CropInfo = {
  scaleX: number;
  scaleY: number;
};

type BP = {
  id: number;
  systolic: number;
  diastolic: number;
  createdAt: string;
};

type GithubPR = {
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

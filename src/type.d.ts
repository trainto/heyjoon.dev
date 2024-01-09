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
  approved: boolean;
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

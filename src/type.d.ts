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

type CropInfo = {
  scaleX: number;
  scaleY: number;
};

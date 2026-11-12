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

export type PlaceLocation = {
  name: string;
  address: string;
  lat: number;
  lng: number;
};

export type Place = {
  id: number;
  desc: string;
  images: string;
  location?: PlaceLocation | null;
  email: string;
  avatar: string;
  nickname: string;
  createdAt: string;
  modifiedAt: string;
  comments: number;
  likes: number;
  likedByMe?: number;
  distance?: number;
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
  sort?: 'distance';
  lat?: string;
  lng?: string;
  lastDistance?: string;
};

export type GetPlaceLocationsQuery = {
  minLat?: string;
  maxLat?: string;
  minLng?: string;
  maxLng?: string;
};

export type PlacePin = {
  id: number;
  lat: number;
  lng: number;
  name: string;
};

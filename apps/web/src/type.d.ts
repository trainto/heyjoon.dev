declare global {
  type PostType = {
    slug: string;
    title: string;
    date: string;
    description?: string;
    content: string;
  };

  type CropInfo = {
    scaleX: number;
    scaleY: number;
  };

  type UserInfo = import('@repo/shared').UserInfo;
  type Place = import('@repo/shared').Place;
  type PlaceLocation = import('@repo/shared').PlaceLocation;
  type PlacePin = import('@repo/shared').PlacePin;
  type CommentInfo = import('@repo/shared').CommentInfo;
  type BP = import('@repo/shared').BP;
  type GithubPR = import('@repo/shared').GithubPR;
  type MusicVideo = import('@repo/shared').MusicVideo;
  type MusicSearchResult = import('@repo/shared').MusicSearchResult;
  type LibraryTrack = import('@repo/shared').LibraryTrack;
  type LibraryTrackEdits = import('@repo/shared').LibraryTrackEdits;
}

export {};

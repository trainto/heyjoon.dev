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
  type CommentInfo = import('@repo/shared').CommentInfo;
  type BP = import('@repo/shared').BP;
  type GithubPR = import('@repo/shared').GithubPR;
}

export {};

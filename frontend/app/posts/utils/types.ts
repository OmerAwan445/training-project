export type ApiPost = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

export type ApiComment = {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
};

export type Post = {
  id: number;
  title: string;
  body: string;
  owner?: { name: string; email: string } | null;
};

export type Comment = {
  id: number;
  postId: number;
  name: string;
  email: string;
  body: string;
  owner?: { name: string; email: string } | null;
};

export type CurrentUser = { name: string; email: string } | null;

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

// Types for the context
export type CommentsMap = Record<number, Comment[]>;

export type PostsContextType = {
  // Comments data
  commentsMap: CommentsMap;
  setCommentsMap: React.Dispatch<React.SetStateAction<CommentsMap>>;
  commentsLoading: boolean;
  commentsError: string | null;

  // Comment actions
  addComment: (postId: number, body: string) => void;
  editComment: (postId: number, commentId: number, newBody: string) => void;
  deleteComment: (postId: number, commentId: number) => void;

  // Utility functions
  getCommentsForPost: (postId: number) => Comment[];
  getCommentCount: (postId: number) => number;
  refreshCommentsForPost: (postId: number) => Promise<void>;
};
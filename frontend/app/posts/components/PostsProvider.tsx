"use client";

import useAuth from "@/app/hooks/useAuth";
import { PostsContext } from "@/app/hooks/usePosts";
import { useEffect, useState } from "react";
import { Comment, CommentsMap, PostsContextType } from "../utils/types";

// Provider component
export function PostsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentUser } = useAuth();
  const [commentsMap, setCommentsMap] = useState<CommentsMap>({});
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [commentsError, setCommentsError] = useState<string | null>(null);

  // Load all comments on mount
  useEffect(() => {
    loadAllComments();
  }, []);

  // Load comments for all posts
  const loadAllComments = async () => {
    setCommentsLoading(true);
    setCommentsError(null);

    try {
      // First, get all posts to know which comments to fetch
      const postsRes = await fetch(
        "https://jsonplaceholder.typicode.com/posts"
      );
      if (!postsRes.ok) throw new Error("Failed to fetch posts for comments");

      const posts = await postsRes.json();
      const postIds = posts.slice(0, 30).map((p: any) => p.id);

      // Fetch comments for all posts in parallel
      const commentsPromises = postIds.map(async (postId: number) => {
        try {
          const res = await fetch(
            `https://jsonplaceholder.typicode.com/posts/${postId}/comments`
          );
          if (!res.ok) return { postId, comments: [] };

          const comments = await res.json();
          return {
            postId,
            comments: comments.map((c: any) => ({
              id: c.id,
              postId: c.postId,
              name: c.name,
              email: c.email,
              body: c.body,
              owner: null, // External comments don't have owners
            })),
          };
        } catch (error) {
          console.error(`Failed to fetch comments for post ${postId}:`, error);
          return { postId, comments: [] };
        }
      });

      // Wait for all comments to load
      const commentsResults = await Promise.all(commentsPromises);

      // Build the comments map
      const newCommentsMap: CommentsMap = {};
      commentsResults.forEach(({ postId, comments }) => {
        newCommentsMap[postId] = comments;
      });

      setCommentsMap(newCommentsMap);
    } catch (error) {
      console.error("Error loading comments:", error);
      setCommentsError(
        error instanceof Error ? error.message : "Failed to load comments"
      );
    } finally {
      setCommentsLoading(false);
    }
  };

  // Refresh comments for a specific post
  const refreshCommentsForPost = async (postId: number) => {
    try {
      const res = await fetch(
        `https://jsonplaceholder.typicode.com/posts/${postId}/comments`
      );
      if (!res.ok)
        throw new Error(`Failed to refresh comments for post ${postId}`);

      const comments = await res.json();
      const formattedComments = comments.map((c: any) => ({
        id: c.id,
        postId: c.postId,
        name: c.name,
        email: c.email,
        body: c.body,
        owner: null,
      }));

      setCommentsMap((prev) => ({
        ...prev,
        [postId]: formattedComments,
      }));
    } catch (error) {
      console.error(`Error refreshing comments for post ${postId}:`, error);
    }
  };

  // Add a new comment
  const addComment = (postId: number, body: string) => {
    if (!currentUser) {
      alert("Please login to comment");
      return;
    }

    if (!body.trim()) return;

  const newComment: Comment = {
      id: Date.now(), // Temporary ID
      postId,
      name: currentUser.name,
      email: currentUser.email,
      body: body.trim(),
      owner: currentUser,
    };

    setCommentsMap((prev) => ({
      ...prev,
      [postId]: [...(prev[postId] || []), newComment],
    }));
  };

  // Edit a comment
  const editComment = (postId: number, commentId: number, newBody: string) => {
    setCommentsMap((prev) => ({
      ...prev,
      [postId]: (prev[postId] || []).map((comment) =>
        comment.id === commentId
          ? { ...comment, body: newBody.trim() }
          : comment
      ),
    }));
  };

  // Delete a comment
  const deleteComment = (postId: number, commentId: number) => {
    if (!confirm("Delete this comment?")) return;

    setCommentsMap((prev) => ({
      ...prev,
      [postId]: (prev[postId] || []).filter(
        (comment) => comment.id !== commentId
      ),
    }));
  };

  // Utility functions
  const getCommentsForPost = (postId: number): Comment[] => {
    return commentsMap[postId] || [];
  };

  const getCommentCount = (postId: number): number => {
    return (commentsMap[postId] || []).length;
  };

  // Context value
  const contextValue: PostsContextType = {
    commentsMap,
    setCommentsMap,
    commentsLoading,
    commentsError,
    addComment,
    editComment,
    deleteComment,
    getCommentsForPost,
    getCommentCount,
    refreshCommentsForPost,
  };

  return (
    <PostsContext.Provider value={contextValue}>
      {children}
    </PostsContext.Provider>
  );
}
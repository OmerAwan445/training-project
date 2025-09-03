"use client";

import React, { useEffect, useState } from "react";
import PostCard from "./PostCard";
import { usePosts } from "@/app/hooks/usePosts";
import { Comment, Post } from "../utils/types";
import useAuth from "@/app/hooks/useAuth";
import CreatePostForm from "./CreatePostForm";

interface AllPostsClientProps {
  initialPosts: Post[];
  initialCommentsMap: Record<number, Comment[]>;
}

const AllPostsClient = ({
  initialPosts,
  initialCommentsMap,
}: AllPostsClientProps) => {
  // 1. Initialize state with the server-fetched data passed as props.
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [editingPostId, setEditingPostId] = useState<number | null>(null);
  const { creating, setCreating } = usePosts();

  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");
  const [editingTitle, setEditingTitle] = useState("");
  const [editingBody, setEditingBody] = useState("");

  const { isAuthorized, currentUser } = useAuth();
  const {
    getCommentsForPost,
    setCommentsMap,
    addComment,
    editComment,
    deleteComment,
  } = usePosts();

  // 2. Set the initial comments in the context.
  useEffect(() => {
    setCommentsMap(initialCommentsMap);
  }, [initialCommentsMap, setCommentsMap]);

  const createPost = () => {
    if (!isAuthorized()) return alert("Please login to create a post");
    if (!newTitle.trim() || !newBody.trim()) return;
    const id = Date.now();
    const p: Post = { id, title: newTitle, body: newBody, owner: currentUser };
    setPosts((s) => [p, ...s]);
    setNewTitle("");
    setNewBody("");
    setCreating(false);
  };

  const startEditPost = (p: Post) => {
    if (!p.owner || !currentUser || p.owner.email !== currentUser.email) return;
    setEditingPostId(p.id);
    setEditingTitle(p.title);
    setEditingBody(p.body);
  };

  const saveEditPost = (id: number) => {
    setPosts((s) =>
      s.map((p) =>
        p.id === id ? { ...p, title: editingTitle, body: editingBody } : p
      )
    );
    setEditingPostId(null);
  };

  const deletePost = (id: number) => {
    const p = posts.find((x) => x.id === id);
    if (p?.owner && currentUser && p.owner.email !== currentUser.email) return;
    if (!confirm("Delete this post?")) return;
    setPosts((s) => s.filter((x) => x.id !== id));
    setCommentsMap((m) => {
      const copy = { ...m };
      delete copy[id];
      return copy;
    });
  };

  return (
    <>
      {creating && (
        <CreatePostForm
          newTitle={newTitle}
          setNewTitle={setNewTitle}
          newBody={newBody}
          setNewBody={setNewBody}
          createPost={createPost}
          setCreating={setCreating}
        />
      )}
      <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            comments={getCommentsForPost(post.id) || []}
            currentUser={currentUser}
            editingPostId={editingPostId}
            editingTitle={editingTitle}
            editingBody={editingBody}
            setEditingTitle={setEditingTitle}
            setEditingBody={setEditingBody}
            startEditPost={startEditPost}
            saveEditPost={saveEditPost}
            deletePost={deletePost}
            setEditingPostId={setEditingPostId}
            addComment={addComment}
            editComment={editComment}
            deleteComment={deleteComment}
          />
        ))}
      </div>
    </>
  );
};

export default AllPostsClient;
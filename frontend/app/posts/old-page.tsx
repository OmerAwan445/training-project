"use client";

import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import CreatePostForm from "./components/CreatePostForm";
import ErrorState from "./components/ErrorState";
import LoadingState from "./components/LoadingState";
import PageHeader from "./components/PageHeader";
import PostCard from "./components/PostCard";
import type { ApiComment, ApiPost, Comment, Post } from "./utils/types";

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [commentsMap, setCommentsMap] = useState<Record<number, Comment[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [creating, setCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");

  const [editingPostId, setEditingPostId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingBody, setEditingBody] = useState("");
  const { isAuthorized, currentUser } = useAuth();

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("https://jsonplaceholder.typicode.com/posts");
        if (!res.ok) throw new Error("Failed to fetch posts");
        const data: ApiPost[] = await res.json();
        if (!mounted) return;

        const sliced = data.slice(0, 30).map((p) => ({
          id: p.id,
          title: p.title,
          body: p.body,
          owner: null,
        }));
        setPosts(sliced);

        const commentsMapLocal: Record<number, Comment[]> = {};
        await Promise.all(
          sliced.map(async (p) => {
            const r = await fetch(
              `https://jsonplaceholder.typicode.com/posts/${p.id}/comments`
            );
            if (!r.ok) return (commentsMapLocal[p.id] = []);
            const cm: ApiComment[] = await r.json();
            commentsMapLocal[p.id] = cm.map((c) => ({
              id: c.id,
              postId: c.postId,
              name: c.name,
              email: c.email,
              body: c.body,
              owner: null,
            }));
          })
        );
        if (!mounted) return;
        setCommentsMap(commentsMapLocal);
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
        else setError(String(err));
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

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

  const addComment = (postId: number, body: string) => {
    if (!isAuthorized()) return alert("Please login to comment");
    if (!body.trim()) return;
    const id = Date.now();
    const c: Comment = {
      id,
      postId,
      name: currentUser!.name,
      email: currentUser!.email,
      body,
      owner: currentUser,
    };
    setCommentsMap((m) => ({ ...m, [postId]: [...(m[postId] || []), c] }));
  };

  const editComment = (postId: number, commentId: number, newBody: string) => {
    setCommentsMap((m) => ({
      ...m,
      [postId]: (m[postId] || []).map((c) =>
        c.id === commentId ? { ...c, body: newBody } : c
      ),
    }));
  };

  const deleteComment = (postId: number, commentId: number) => {
    if (!confirm("Delete this comment?")) return;
    setCommentsMap((m) => ({
      ...m,
      [postId]: (m[postId] || []).filter((c) => c.id !== commentId),
    }));
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto p-6">
        <PageHeader
          currentUser={currentUser}
          creating={creating}
          setCreating={setCreating}
        />

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
              comments={commentsMap[post.id] || []}
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
      </div>
    </div>
  );
}

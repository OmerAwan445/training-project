import React from "react";
import { ApiComment, ApiPost, Comment, Post } from "../utils/types";
import AllPostsClient from "./AllPostsClient";

// 1. The component is now an async function to allow for server-side data fetching.
const AllPosts = async () => {
  // 2. Data fetching logic is moved directly into the Server Component.
  const postsRes = await fetch("https://jsonplaceholder.typicode.com/posts", {
    // This ensures fresh data on each request, you can adjust caching as needed.
    cache: "no-store", 
  });
  if (!postsRes.ok) throw new Error("Failed to fetch posts");
  const postsData: ApiPost[] = await postsRes.json();

  const initialPosts: Post[] = postsData.slice(0, 30).map((p) => ({
    id: p.id,
    title: p.title,
    body: p.body,
    owner: null,
  }));

  const commentsMapLocal: Record<number, Comment[]> = {};
  await Promise.all(
    initialPosts.map(async (p) => {
      const commentsRes = await fetch(
        `https://jsonplaceholder.typicode.com/posts/${p.id}/comments`
      );
      if (!commentsRes.ok) {
        commentsMapLocal[p.id] = [];
        return;
      }
      const cm: ApiComment[] = await commentsRes.json();
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

  // 3. The server-fetched data is passed as props to the new client component.
  return (
    <AllPostsClient
      initialPosts={initialPosts}
      initialCommentsMap={commentsMapLocal}
    />
  );
};

export default AllPosts;
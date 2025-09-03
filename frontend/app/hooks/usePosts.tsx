"use client";

import { createContext, useContext } from "react";
import type { PostsContextType } from "../posts/utils/types";

// Create the context
export const PostsContext = createContext<PostsContextType | undefined>(undefined);

// Custom hook to use the context
export function usePosts() {
  const context = useContext(PostsContext);
  if (context === undefined) {
    throw new Error("usePosts must be used within a PostsProvider");
  }
  return context;
}

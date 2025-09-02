"use client";
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { User, Edit2, Trash2, Save, X } from "lucide-react";
import CommentsSection from "./CommentsSection";
import type { Post, Comment, CurrentUser } from "../utils/types";

export default function PostCard({
  post,
  comments,
  currentUser,
  editingPostId,
  editingTitle,
  editingBody,
  setEditingTitle,
  setEditingBody,
  startEditPost,
  saveEditPost,
  deletePost,
  setEditingPostId,
  addComment,
  editComment,
  deleteComment,
}: {
  post: Post;
  comments: Comment[];
  currentUser: CurrentUser;
  editingPostId: number | null;
  editingTitle: string;
  editingBody: string;
  setEditingTitle: (title: string) => void;
  setEditingBody: (body: string) => void;
  startEditPost: (post: Post) => void;
  saveEditPost: (id: number) => void;
  deletePost: (id: number) => void;
  setEditingPostId: (id: number | null) => void;
  addComment: (postId: number, body: string) => void;
  editComment: (postId: number, commentId: number, newBody: string) => void;
  deleteComment: (postId: number, commentId: number) => void;
}) {
  const isOwner =
    post.owner && currentUser && post.owner.email === currentUser.email;
  const isEditing = editingPostId === post.id;

  return (
    <Card className="h-fit hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <Input
                value={editingTitle}
                onChange={(e) => setEditingTitle(e.target.value)}
                className="font-semibold text-lg"
              />
            ) : (
              <CardTitle className="text-lg leading-tight text-gray-800 line-clamp-2">
                {post.title}
              </CardTitle>
            )}
          </div>
          <div className="flex items-center gap-2">
            {post.owner ? (
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                <User className="h-3 w-3 mr-1" />
                {post.owner.name}
              </Badge>
            ) : (
              <Badge variant="outline" className="text-gray-500">
                External
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {isEditing ? (
          <Textarea
            value={editingBody}
            onChange={(e) => setEditingBody(e.target.value)}
            rows={3}
            className="resize-none"
          />
        ) : (
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-4">{post.body}</p>
        )}

        {isOwner && (
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button size="sm" onClick={() => saveEditPost(post.id)} className="bg-green-600 hover:bg-green-700">
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </Button>
                <Button size="sm" variant="outline" onClick={() => setEditingPostId(null)}>
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button size="sm" variant="outline" onClick={() => startEditPost(post)}>
                  <Edit2 className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button size="sm" variant="outline" onClick={() => deletePost(post.id)} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </>
            )}
          </div>
        )}

        <Separator />

        <CommentsSection
          postId={post.id}
          comments={comments}
          addComment={addComment}
          editComment={editComment}
          deleteComment={deleteComment}
          currentUser={currentUser}
        />
      </CardContent>
    </Card>
  );
}

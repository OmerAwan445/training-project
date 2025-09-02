"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Plus } from "lucide-react";
import CommentCard from "./CommentCard";
import type { Comment, CurrentUser } from "../utils/types";

export default function CommentsSection({
  postId,
  comments,
  addComment,
  editComment,
  deleteComment,
  currentUser,
}: {
  postId: number;
  comments: Comment[];
  addComment: (postId: number, body: string) => void;
  editComment: (postId: number, commentId: number, newBody: string) => void;
  deleteComment: (postId: number, commentId: number) => void;
  currentUser: CurrentUser;
}) {
  const [showAdd, setShowAdd] = useState(false);
  const [newBody, setNewBody] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingBody, setEditingBody] = useState("");

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">
            {comments.length} {comments.length === 1 ? "Comment" : "Comments"}
          </span>
        </div>
        {currentUser ? (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowAdd(!showAdd)}
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Comment
          </Button>
        ) : (
          <Link href="/users/login">
            <Button size="sm" variant="ghost" className="text-gray-500">
              Sign in to comment
            </Button>
          </Link>
        )}
      </div>

      {showAdd && currentUser && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-4">
            <Textarea
              rows={3}
              value={newBody}
              onChange={(e) => setNewBody(e.target.value)}
              placeholder="Share your thoughts..."
              className="resize-none"
            />
            <div className="flex justify-end gap-2 mt-3">
              <Button size="sm" variant="outline" onClick={() => setShowAdd(false)}>
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  addComment(postId, newBody);
                  setNewBody("");
                  setShowAdd(false);
                }}
                className="bg-green-600 hover:bg-green-700"
              >
                Post Comment
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {comments.length > 0 && (
        <div className="space-y-3">
          {comments.map((comment) => (
            <CommentCard
              key={comment.id}
              comment={comment}
              postId={postId}
              currentUser={currentUser}
              editingId={editingId}
              editingBody={editingBody}
              setEditingId={setEditingId}
              setEditingBody={setEditingBody}
              editComment={editComment}
              deleteComment={deleteComment}
            />
          ))}
        </div>
      )}
    </div>
  );
}

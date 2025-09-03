"use client";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mail, Edit2, Trash2, Save, X } from "lucide-react";
import type { Comment } from "../utils/types";
import { CurrentUser } from "@/app/commons/types";

export default function CommentCard({
  comment,
  postId,
  currentUser,
  editingId,
  editingBody,
  setEditingId,
  setEditingBody,
  editComment,
  deleteComment,
}: {
  comment: Comment;
  postId: number;
  currentUser: CurrentUser;
  editingId: number | null;
  editingBody: string;
  setEditingId: (id: number | null) => void;
  setEditingBody: (body: string) => void;
  editComment: (postId: number, commentId: number, newBody: string) => void;
  deleteComment: (postId: number, commentId: number) => void;
}) {
  const isOwner =
    comment.owner && currentUser && comment.owner.email === currentUser.email;
  const isEditing = editingId === comment.id;

  return (
    <Card className="bg-gray-50 border-gray-200">
      <CardContent className="pt-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full h-8 w-8 flex items-center justify-center text-sm font-medium">
              {comment.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="font-medium text-gray-800 text-sm">{comment.name}</div>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Mail className="h-3 w-3" />
                {comment.email}
              </div>
            </div>
          </div>
          {isOwner && (
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              You
            </Badge>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-3">
            <Textarea
              rows={3}
              value={editingBody}
              onChange={(e) => setEditingBody(e.target.value)}
              className="resize-none"
            />
            <div className="flex gap-2 justify-end">
              <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  editComment(postId, comment.id, editingBody);
                  setEditingId(null);
                }}
                className="bg-green-600 hover:bg-green-700"
              >
                <Save className="h-4 w-4 mr-1" />
                Save
              </Button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-gray-700 text-sm leading-relaxed mb-3">{comment.body}</p>
            {isOwner && (
              <div className="flex gap-2 justify-end">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setEditingId(comment.id);
                    setEditingBody(comment.body);
                  }}
                  className="text-gray-600 hover:text-gray-700"
                >
                  <Edit2 className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => deleteComment(postId, comment.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Delete
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

"use client";
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { X, Save } from "lucide-react";

export default function CreatePostForm({
  newTitle,
  setNewTitle,
  newBody,
  setNewBody,
  createPost,
  setCreating,
}: {
  newTitle: string;
  setNewTitle: (title: string) => void;
  newBody: string;
  setNewBody: (body: string) => void;
  createPost: () => void;
  setCreating: (creating: boolean) => void;
}) {
  return (
    <Card className="mb-8 border-green-200 bg-green-50">
      <CardHeader>
        <CardTitle className="text-lg text-green-800">Create New Post</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="title" className="text-sm font-medium text-gray-700">
            Title
          </Label>
          <Input
            id="title"
            placeholder="Enter your post title..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="body" className="text-sm font-medium text-gray-700">
            Content
          </Label>
          <Textarea
            id="body"
            placeholder="What's on your mind?"
            value={newBody}
            onChange={(e) => setNewBody(e.target.value)}
            rows={4}
            className="mt-1"
          />
        </div>
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={() => setCreating(false)}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={createPost} className="bg-green-600 hover:bg-green-700">
            <Save className="h-4 w-4 mr-2" />
            Publish Post
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

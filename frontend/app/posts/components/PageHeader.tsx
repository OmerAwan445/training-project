"use client";
import useAuth from "@/app/hooks/useAuth";
import { usePosts } from "@/app/hooks/usePosts";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PageHeader() {
  const router = useRouter();
  const { isAuthorized, currentUser } = useAuth();
  const { creating, setCreating } = usePosts();


  return (
    <Card className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-3xl font-bold text-gray-800">
              Community Posts
            </CardTitle>
            <CardDescription className="text-gray-600 mt-2">
              Share your thoughts and engage with the community
            </CardDescription>
          </div>
          <div className="flex items-center gap-4">
            {currentUser ? (
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border">
                <User className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">
                  {currentUser.name}
                </span>
              </div>
            ) : (
              <Link href="/users/login">
                <Button variant="outline" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  Sign in
                </Button>
              </Link>
            )}
            <Button
              onClick={() => {
                if (isAuthorized()) setCreating(!creating);
                else {
                  alert("Please login to create a post");
                  router.push("/users/login?fallbackUrl=/posts");
                }
              }}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              {creating ? "Cancel" : "New Post"}
            </Button>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}

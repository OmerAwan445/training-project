import { usePosts } from "@/app/hooks/usePosts";

export function CommentsProvider({ children }: { children: React.ReactNode }) {
  const { commentsLoading, commentsError } = usePosts();

  if (commentsLoading) {
    return (
      <div className="text-center py-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
        <p className="text-sm text-gray-600">Loading comments...</p>
      </div>
    );
  }

  if (commentsError) {
    return (
      <div className="text-center py-4 text-red-600">
        <p className="text-sm">Failed to load comments</p>
        <button
          onClick={() => window.location.reload()}
          className="text-xs underline mt-1"
        >
          Retry
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
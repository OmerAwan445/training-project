export const experimental_ppr = true;

import { Suspense } from "react";
import AllPosts from "./components/AllPosts";
import LoadingState from "./components/LoadingState";
import PageHeader from "./components/PageHeader";

export default function PostsPage() {
  // if (error) return <ErrorState error={error} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto p-6">
        <PageHeader /> {/* Dynamic Component using states and hooks */}
        <Suspense fallback={<LoadingState />}>
          <AllPosts />{" "}
          {/* Dynamic Component using states, hooks and making api call */}
        </Suspense>
      </div>
    </div>
  );
}

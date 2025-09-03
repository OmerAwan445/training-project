import { PostsProvider } from './components/PostsProvider';

export default function PostsLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <PostsProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-6xl mx-auto p-6">
          {children}
        </div>
      </div>
    </PostsProvider>
  );
}
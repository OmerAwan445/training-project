import Link from "next/link";

export default function TopBar() {
  return (
    <nav className="flex items-center justify-between mb-6 py-4 px-6 bg-white rounded shadow">
      <div className="text-xl font-bold text-indigo-700">Practice Project</div>
      <div className="space-x-4">
        <Link href="/" className="text-indigo-600 hover:underline">
          Home
        </Link>
        <Link href="/posts" className="text-indigo-600 hover:underline">
          Posts
        </Link>
        <Link href="/profile" className="text-indigo-600 hover:underline">
          Profile
        </Link>
      </div>
    </nav>
  );
}

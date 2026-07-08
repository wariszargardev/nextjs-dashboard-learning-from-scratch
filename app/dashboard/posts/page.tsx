import Link from "next/link";
import * as postService from "@/lib/services/postService";

export default async function PostsPage() {
  const { data: posts } = await postService.listPosts({ perPage: 100 });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Posts</h1>
        <Link
          href="/dashboard/posts/new"
          className="rounded-md bg-foreground text-background px-4 py-2 text-sm font-medium"
        >
          New post
        </Link>
      </div>

      <div className="border border-black/10 dark:border-white/10 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-black/5 dark:bg-white/5 text-left">
            <tr>
              <th className="px-4 py-2 font-medium">Title</th>
              <th className="px-4 py-2 font-medium">Author</th>
              <th className="px-4 py-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} className="border-t border-black/10 dark:border-white/10">
                <td className="px-4 py-2">
                  <Link href={`/dashboard/posts/${post.id}`} className="hover:underline">
                    {post.title}
                  </Link>
                </td>
                <td className="px-4 py-2 text-foreground/70">
                  <Link href={`/dashboard/users/${post.author.id}`} className="hover:underline">
                    {post.author.name}
                  </Link>
                </td>
                <td className="px-4 py-2 text-foreground/70">
                  {post.published ? "Published" : "Draft"}
                </td>
              </tr>
            ))}
            {posts.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center text-foreground/50">
                  No posts yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

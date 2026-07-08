import Link from "next/link";
import { notFound } from "next/navigation";
import * as userService from "@/lib/services/userService";
import * as postService from "@/lib/services/postService";

export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const user = await userService.getUserById(id);
  if (!user) {
    notFound();
  }

  const { data: posts } = await postService.listPosts({ authorId: id, perPage: 100 });

  return (
    <div>
      <Link href="/dashboard/users" className="text-sm text-foreground/60 hover:underline">
        &larr; Back to users
      </Link>

      <h1 className="text-2xl font-semibold mt-2">{user.name}</h1>
      <p className="text-foreground/60">{user.email}</p>
      <p className="text-sm text-foreground/60 mt-1">Role: {user.role}</p>

      <h2 className="text-lg font-semibold mt-8 mb-3">Posts by {user.name}</h2>
      <ul className="flex flex-col gap-2">
        {posts.map((post) => (
          <li key={post.id} className="border border-black/10 dark:border-white/10 rounded-md px-4 py-3">
            <Link href={`/dashboard/posts/${post.id}`} className="font-medium hover:underline">
              {post.title}
            </Link>
            <span className="ml-2 text-xs text-foreground/50">
              {post.published ? "Published" : "Draft"}
            </span>
          </li>
        ))}
        {posts.length === 0 && <p className="text-foreground/50 text-sm">No posts yet.</p>}
      </ul>
    </div>
  );
}

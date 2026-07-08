import Link from "next/link";
import * as userService from "@/lib/services/userService";
import * as postService from "@/lib/services/postService";
import * as commentService from "@/lib/services/commentService";

export default async function DashboardOverviewPage() {
  const [users, posts, comments] = await Promise.all([
    userService.listUsers({ perPage: 1 }),
    postService.listPosts({ perPage: 1 }),
    commentService.listComments({ perPage: 1 }),
  ]);

  const stats = [
    { label: "Users", total: users.total, href: "/dashboard/users" },
    { label: "Posts", total: posts.total, href: "/dashboard/posts" },
    { label: "Comments", total: comments.total, href: "/dashboard/comments" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Overview</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="rounded-lg border border-black/10 dark:border-white/10 p-5 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <p className="text-sm text-foreground/60">{stat.label}</p>
            <p className="text-3xl font-semibold mt-1">{stat.total}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

import Link from "next/link";
import * as commentService from "@/lib/services/commentService";
import * as postService from "@/lib/services/postService";

export default async function CommentsPage() {
  const [{ data: comments }, posts] = await Promise.all([
    commentService.listComments({ perPage: 100 }),
    postService.listAllPosts(),
  ]);

  const postTitleById = new Map(posts.map((post) => [post.id, post.title]));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Comments</h1>
        <Link
          href="/dashboard/comments/new"
          className="rounded-md bg-foreground text-background px-4 py-2 text-sm font-medium"
        >
          New comment
        </Link>
      </div>

      <div className="border border-black/10 dark:border-white/10 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-black/5 dark:bg-white/5 text-left">
            <tr>
              <th className="px-4 py-2 font-medium">Comment</th>
              <th className="px-4 py-2 font-medium">Author</th>
              <th className="px-4 py-2 font-medium">Post</th>
            </tr>
          </thead>
          <tbody>
            {comments.map((comment) => (
              <tr key={comment.id} className="border-t border-black/10 dark:border-white/10">
                <td className="px-4 py-2 max-w-sm truncate">{comment.content}</td>
                <td className="px-4 py-2 text-foreground/70">
                  <Link href={`/dashboard/users/${comment.author.id}`} className="hover:underline">
                    {comment.author.name}
                  </Link>
                </td>
                <td className="px-4 py-2 text-foreground/70">
                  <Link href={`/dashboard/posts/${comment.postId}`} className="hover:underline">
                    {postTitleById.get(comment.postId) ?? "Untitled"}
                  </Link>
                </td>
              </tr>
            ))}
            {comments.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center text-foreground/50">
                  No comments yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

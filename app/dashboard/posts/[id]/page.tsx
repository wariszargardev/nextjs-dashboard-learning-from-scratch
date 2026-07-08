import Link from "next/link";
import { notFound } from "next/navigation";
import * as postService from "@/lib/services/postService";
import * as commentService from "@/lib/services/commentService";
import * as userService from "@/lib/services/userService";
import { createCommentAction } from "@/lib/actions/commentActions";

export default async function PostDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;

  const post = await postService.getPostById(id);
  if (!post) {
    notFound();
  }

  const [{ data: comments }, authors] = await Promise.all([
    commentService.listComments({ postId: id, perPage: 100 }),
    userService.listAllUsers(),
  ]);

  return (
    <div className="max-w-2xl">
      <Link href="/dashboard/posts" className="text-sm text-foreground/60 hover:underline">
        &larr; Back to posts
      </Link>

      <h1 className="text-2xl font-semibold mt-2">{post.title}</h1>
      <p className="text-sm text-foreground/60 mb-4">
        by{" "}
        <Link href={`/dashboard/users/${post.author.id}`} className="hover:underline">
          {post.author.name}
        </Link>{" "}
        &middot; {post.published ? "Published" : "Draft"}
      </p>
      <p className="whitespace-pre-wrap">{post.content}</p>

      <h2 className="text-lg font-semibold mt-8 mb-3">Comments</h2>

      {error && (
        <p className="mb-4 rounded-md bg-red-500/10 text-red-600 dark:text-red-400 px-3 py-2 text-sm">
          {error}
        </p>
      )}

      <ul className="flex flex-col gap-3 mb-6">
        {comments.map((comment) => (
          <li key={comment.id} className="border border-black/10 dark:border-white/10 rounded-md px-4 py-3">
            <p>{comment.content}</p>
            <p className="text-xs text-foreground/50 mt-1">by {comment.author.name}</p>
          </li>
        ))}
        {comments.length === 0 && <p className="text-foreground/50 text-sm">No comments yet.</p>}
      </ul>

      {authors.length === 0 ? (
        <p className="text-sm text-foreground/60">Create a user before you can add a comment.</p>
      ) : (
        <form action={createCommentAction} className="flex flex-col gap-3">
          <input type="hidden" name="postId" value={post.id} />
          <input type="hidden" name="returnTo" value={`/dashboard/posts/${post.id}`} />

          <label className="flex flex-col gap-1 text-sm">
            Comment
            <textarea
              name="content"
              required
              rows={3}
              className="rounded-md border border-black/20 dark:border-white/20 bg-transparent px-3 py-2"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm">
            Author
            <select
              name="authorId"
              required
              className="rounded-md border border-black/20 dark:border-white/20 bg-transparent px-3 py-2"
            >
              {authors.map((author) => (
                <option key={author.id} value={author.id}>
                  {author.name} ({author.email})
                </option>
              ))}
            </select>
          </label>

          <button
            type="submit"
            className="self-start rounded-md bg-foreground text-background px-4 py-2 text-sm font-medium"
          >
            Add comment
          </button>
        </form>
      )}
    </div>
  );
}

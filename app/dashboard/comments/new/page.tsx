import { createCommentAction } from "@/lib/actions/commentActions";
import * as userService from "@/lib/services/userService";
import * as postService from "@/lib/services/postService";
import { SubmitButton } from "@/components/ui/SubmitButton";

export default async function NewCommentPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const [authors, posts] = await Promise.all([
    userService.listAllUsers(),
    postService.listAllPosts(),
  ]);

  return (
    <div className="max-w-md">
      <h1 className="text-2xl font-semibold mb-6">New comment</h1>

      {error && (
        <p className="mb-4 rounded-md bg-red-500/10 text-red-600 dark:text-red-400 px-3 py-2 text-sm">
          {error}
        </p>
      )}

      {authors.length === 0 || posts.length === 0 ? (
        <p className="text-sm text-foreground/60">
          You need at least one user and one post before you can add a comment.
        </p>
      ) : (
        <form action={createCommentAction} className="flex flex-col gap-4">
          <input type="hidden" name="returnTo" value="/dashboard/comments/new" />

          <label className="flex flex-col gap-1 text-sm">
            Post
            <select
              name="postId"
              required
              className="rounded-md border border-black/20 dark:border-white/20 bg-transparent px-3 py-2"
            >
              {posts.map((post) => (
                <option key={post.id} value={post.id}>
                  {post.title}
                </option>
              ))}
            </select>
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

          <label className="flex flex-col gap-1 text-sm">
            Comment
            <textarea
              name="content"
              required
              rows={4}
              className="rounded-md border border-black/20 dark:border-white/20 bg-transparent px-3 py-2"
            />
          </label>

          <SubmitButton
            pendingLabel="Adding..."
            className="mt-2 rounded-md bg-foreground text-background px-4 py-2 text-sm font-medium"
          >
            Add comment
          </SubmitButton>
        </form>
      )}
    </div>
  );
}

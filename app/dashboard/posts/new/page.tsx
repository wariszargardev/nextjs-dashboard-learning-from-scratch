import { createPostAction } from "@/lib/actions/postActions";
import * as userService from "@/lib/services/userService";
import { SubmitButton } from "@/components/ui/SubmitButton";

export default async function NewPostPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const authors = await userService.listAllUsers();

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-semibold mb-6">New post</h1>

      {error && (
        <p className="mb-4 rounded-md bg-red-500/10 text-red-600 dark:text-red-400 px-3 py-2 text-sm">
          {error}
        </p>
      )}

      {authors.length === 0 ? (
        <p className="text-sm text-foreground/60">
          You need at least one user before you can create a post. Create a user first.
        </p>
      ) : (
        <form action={createPostAction} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-sm">
            Title
            <input
              name="title"
              required
              className="rounded-md border border-black/20 dark:border-white/20 bg-transparent px-3 py-2"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm">
            Content
            <textarea
              name="content"
              required
              rows={5}
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

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="published" />
            Published
          </label>

          <SubmitButton
            pendingLabel="Creating..."
            className="mt-2 rounded-md bg-foreground text-background px-4 py-2 text-sm font-medium"
          >
            Create post
          </SubmitButton>
        </form>
      )}
    </div>
  );
}

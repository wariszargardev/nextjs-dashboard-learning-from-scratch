import { createUserAction } from "@/lib/actions/userActions";

export default async function NewUserPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="max-w-md">
      <h1 className="text-2xl font-semibold mb-6">New user</h1>

      {error && (
        <p className="mb-4 rounded-md bg-red-500/10 text-red-600 dark:text-red-400 px-3 py-2 text-sm">
          {error}
        </p>
      )}

      <form action={createUserAction} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm">
          Name
          <input
            name="name"
            required
            className="rounded-md border border-black/20 dark:border-white/20 bg-transparent px-3 py-2"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Email
          <input
            type="email"
            name="email"
            required
            className="rounded-md border border-black/20 dark:border-white/20 bg-transparent px-3 py-2"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Role
          <select
            name="role"
            defaultValue="USER"
            className="rounded-md border border-black/20 dark:border-white/20 bg-transparent px-3 py-2"
          >
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </label>

        <button
          type="submit"
          className="mt-2 rounded-md bg-foreground text-background px-4 py-2 text-sm font-medium"
        >
          Create user
        </button>
      </form>
    </div>
  );
}

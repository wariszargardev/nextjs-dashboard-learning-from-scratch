import Link from "next/link";
import * as userService from "@/lib/services/userService";

export default async function UsersPage() {
  const { data: users } = await userService.listUsers({ perPage: 100 });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Users</h1>
        <Link
          href="/dashboard/users/new"
          className="rounded-md bg-foreground text-background px-4 py-2 text-sm font-medium"
        >
          New user
        </Link>
      </div>

      <div className="border border-black/10 dark:border-white/10 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-black/5 dark:bg-white/5 text-left">
            <tr>
              <th className="px-4 py-2 font-medium">Name</th>
              <th className="px-4 py-2 font-medium">Email</th>
              <th className="px-4 py-2 font-medium">Role</th>
              <th className="px-4 py-2 font-medium">Posts</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t border-black/10 dark:border-white/10">
                <td className="px-4 py-2">
                  <Link href={`/dashboard/users/${user.id}`} className="hover:underline">
                    {user.name}
                  </Link>
                </td>
                <td className="px-4 py-2 text-foreground/70">{user.email}</td>
                <td className="px-4 py-2 text-foreground/70">{user.role}</td>
                <td className="px-4 py-2 text-foreground/70">{user.postsCount}</td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-foreground/50">
                  No users yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

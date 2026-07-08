"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/users", label: "Users" },
  { href: "/dashboard/posts", label: "Posts" },
  { href: "/dashboard/comments", label: "Comments" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <nav className="w-56 shrink-0 border-r border-black/10 dark:border-white/10 p-4 flex flex-col gap-1">
      <span className="px-3 pb-3 text-lg font-semibold">Dashboard</span>
      {NAV_LINKS.map((link) => {
        const isActive =
          link.href === "/dashboard" ? pathname === link.href : pathname.startsWith(link.href);

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              isActive
                ? "bg-black/10 dark:bg-white/15 text-foreground"
                : "text-foreground/70 hover:bg-black/5 dark:hover:bg-white/10"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

'use client';

import { navLinks } from '@/app/lib/dashboard-nav-links';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

export default function NavLinks() {
  const pathName = usePathname()
  return (
    <nav className="flex flex-col gap-4">
      {
        navLinks.map ((link) => {
          const {name, url} = link
         return (
          <Link key={name} href={url} className={clsx(
            'flex h-[48px] grow items-center justify-center gap-2 rounded-md p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
            {
            "bg-sky-100 text-blue-600" : pathName === url
          })}>
            {name}
          </Link>
         )
        })
      }
    </nav>
  )
}

'use clients'
import { navLinks } from '@/app/lib/dashboard-nav-links';
import Link from 'next/link';

export default function NavLinks() {
  return (
    <nav className="flex flex-col gap-4">
      {
        navLinks.map ((link) => {
          const {name, url} = link
         return (
          <Link key={name} href={url} className="hover:text-gray-300 transition-colors">
            {name}
          </Link>
         )
        })
      }
    </nav>
  )
}

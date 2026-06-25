import Link from 'next/link';

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-900 text-white h-screen fixed top-0 left-0 p-5 flex flex-col justify-between">
      <div>
        <div className="text-xl font-bold mb-8">Afia Insurance</div>
        <nav className="flex flex-col gap-4">
          <Link href="/dashboard" className="hover:text-gray-300 transition-colors">
            Dashboard
          </Link>
          <Link href="/dashboard/customer" className="hover:text-gray-300 transition-colors">
            Customers
          </Link>
          <Link href="/dashboard/invoices" className="hover:text-gray-300 transition-colors">
            Invoices
          </Link>
        </nav>
      </div>
      <div className="text-sm text-gray-500">
        © 2026 Afia Insurance
      </div>
    </aside>
  );
}

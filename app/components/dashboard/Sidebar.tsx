import NavLinks from './nav-links';

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-900 text-white h-screen fixed top-0 left-0 p-5 flex flex-col justify-between">
      <div>
        <div className="text-xl font-bold mb-8">Afia Insurance</div>
        <NavLinks />
      </div>
      <div className="text-sm text-gray-500">
        © 2026 Afia Insurance
      </div>
    </aside>
  );
}

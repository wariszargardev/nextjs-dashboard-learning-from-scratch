import Sidebar from "@/components/dashboard/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 min-h-full">
      <Sidebar />
      <main className="flex-1 p-8 overflow-x-auto">{children}</main>
    </div>
  );
}

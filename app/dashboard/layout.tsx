import Sidebar from "../components/dashboard/Sidebar";

export default function DashboardLayout(props: LayoutProps<'/dashboard'>) {
    return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar Component */}
      <Sidebar />

      {/* Main Content Area */}
      {/* ml-64 shifts the content to the right so it doesn't hide behind the fixed sidebar */}
      <main className="flex-1 ml-64 p-8">
        {props.children}
      </main>
    </div>
    )
}

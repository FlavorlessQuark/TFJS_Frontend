import Sidebar from "@/components/layout/sidebar";
import MobileSidebar from "@/components/layout/mobile-sidebar.tsx";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen w-full overflow-x-hidden md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden bg-muted/40 md:block border-r ">
        <Sidebar />
      </div>
      <div className="flex flex-col">
        <MobileSidebar />
        {children}
      </div>
    </div>
  )
}

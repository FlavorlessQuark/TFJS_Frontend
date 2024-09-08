import Navbar from "@/components/layout/navbar";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen max-h-screen overflow-x-hidden">
      <div className="flex flex-col max-h-screen w-full">
        <Navbar />
        <div className="overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  )
}

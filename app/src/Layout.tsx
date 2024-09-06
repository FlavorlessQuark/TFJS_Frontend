import Navbar from "@/components/layout/navbar";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen overflow-x-hidden">
      <div className="flex flex-col w-full">
        <Navbar />
        {children}
      </div>
    </div>
  )
}

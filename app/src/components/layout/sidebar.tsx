import Header from "@/components/layout/header.tsx";
import UserSelector from "@/components/layout/user-selector.tsx";
import NavList from "@/components/layout/nav-list.tsx";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Button} from "@/components/ui/button.tsx";

const Sidebar = () => {
  return (
    <div className="flex h-full max-h-screen flex-col gap-2">
      <Header/>
      <div className="p-4">
        <UserSelector/>
      </div>
      <NavList/>
      <div className="mt-auto p-4">
        <Card x-chunk="dashboard-02-chunk-0">
          <CardHeader className="p-2 pt-0 md:p-4">
            <CardTitle className="flex flex-row gap-x-2 items-center">
              <img src="/convex.svg" alt="convex" className="h-6 w-6"/> Powered by Convex
            </CardTitle>
            <CardDescription>
              A complete, reactive, typesafe backend with authentication and file storage.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
            <Button size="sm" className="w-full" onClick={() => window.open('https://convex.dev')}>
              Visit
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Sidebar;
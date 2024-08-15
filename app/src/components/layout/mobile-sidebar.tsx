import {Sheet, SheetContent, SheetTrigger} from "@/components/ui/sheet.tsx";
import {Button} from "@/components/ui/button.tsx";
import { Menu, Search } from "lucide-react";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Input} from "@/components/ui/input.tsx";
import Header from "@/components/layout/header.tsx";
import UserSelector from "@/components/layout/user-selector.tsx";
import NavList from "@/components/layout/nav-list.tsx";
import AddContainerDialog from "@/components/AddContainerDialog.tsx";

const MobileSidebar = () => {
  return (
    <header className="flex space-between h-14 items-center gap-4 bg-muted/40 px-4 lg:h-[60px] lg:px-6 border-b">
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="shrink-0 md:hidden bg-muted"
          >
            <Menu className="h-5 w-5"/>
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col p-0">
          <Header/>
          <div className="p-4">
            <UserSelector/>
          </div>
          <NavList/>
          <div className="mt-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex flex-row gap-x-2 items-center">
                  <img src="./convex.svg" alt="convex" className="h-6 w-6"/> Powered by Convex
                </CardTitle>
                <CardDescription>
                  A complete, reactive, typesafe backend with authentication and file storage.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button size="sm" className="w-full" onClick={() => window.open('https://convex.dev')}>
                  Visit
                </Button>
              </CardContent>
            </Card>
          </div>
        </SheetContent>
      </Sheet>
      <div className="w-full flex-1">
        <form>
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"/>
            <Input
              type="search"
              placeholder="Search models..."
              className="w-full bg-muted pl-8 shadow-none md:w-2/3 lg:w-full"
            />
          </div>
        </form>
      </div>
      <AddContainerDialog />
    </header>
  )
}

export default MobileSidebar;
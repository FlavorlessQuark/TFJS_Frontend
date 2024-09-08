import {Sheet, SheetContent, SheetTrigger} from "@/components/ui/sheet.tsx";
import {Button} from "@/components/ui/button.tsx";
import { Menu } from "lucide-react";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import Header from "@/components/layout/header.tsx";
import UserSelector from "@/components/layout/user-selector.tsx";
import NavList from "@/components/layout/nav-list.tsx";
import { Link } from "@tanstack/react-router";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import NavSelector from "./nav-selector";

const Navbar = () => {
  const router = useRouter();
  const [pathname, setPathname] = useState(router.latestLocation.pathname);

  useEffect(() => {
    const unsubscribe = router.subscribe('onResolved', (updatedRouter) => {
      console.log("updatedRouter", updatedRouter)
      setPathname(updatedRouter.toLocation.pathname);
    });

    return () => unsubscribe();
  }, [router]);

  return (
    <div className="flex flex-col">
    <header className="flex h-14 items-center gap-4 bg-zinc-950 px-4 lg:h-[40px] lg:px-6 border-b">
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
                  <img src="/convex.svg" alt="convex" className="h-6 w-6"/> Powered by Convex
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
      <div className="flex flex-row items-center justify-between w-full">
        <div className="w-full flex flex-row items-center space-x-4">
        <Header />
        <Tabs value={pathname}>
          <TabsList className="flex space-x-4 text-xs !bg-transparent pb-1">
            <TabsTrigger onClick={() => setPathname('/')} value="/" className="p-2" asChild>
              <Link to="/" className={`p-2 ${pathname === '/' ? 'border-b border-white' : ''}`}>
                <span className={`${pathname === '/' ? 'text-white' : 'text-gray-400'}`}>Home</span>
              </Link>
            </TabsTrigger>
              <TabsTrigger onClick={() => setPathname('/containers')} value="/containers" className="p-2" asChild>
              <Link to="/containers" className={`p-2 ${pathname === '/containers' ? 'border-b border-white' : ''}`}>
                <span>Containers</span>
              </Link>
            </TabsTrigger>
            <TabsTrigger onClick={() => setPathname('/community')} value="/community" className="p-2" asChild>
              <Link to="/community" className={`p-2 ${pathname === '/community' ? 'border-b border-white' : ''}`}>
                <span>Community</span>
              </Link>
            </TabsTrigger>
          </TabsList>
        </Tabs>
        </div>

        <div className="flex flex-row items-center space-x-4">
          <UserSelector/>
        </div>
      </div>
    </header>
    <NavSelector pathname={pathname} />
    </div>
  )
}

export default Navbar;
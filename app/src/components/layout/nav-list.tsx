import { Link, useLocation } from "@tanstack/react-router";
import {Box, Boxes, Home} from "lucide-react";
import {cn} from "@/lib/utils.ts";

const NavList = () => {
  const location = useLocation();
  let path = location.pathname;

  const menuLinks = [
    {
      name: "Home",
      icon: Home,
      href: "/",
    },
    {
      name: "My Containers",
      icon: Box,
      href: "/containers",
    },
    {
      name: "Community",
      icon: Boxes,
      href: "/community",
    },
  ];

  const renderMenuLinks = () => {
    return menuLinks.map((link) => {
      const Icon = link.icon;
      return (
        <Link
          key={link.name}
          className={cn(
            "border-y border-transparent hover:border-muted hover:border-y flex items-center gap-3 px-6 py-2 text-muted-foreground transition-all hover:text-primary",
            {
              "border-muted": path === link.href,
              "text-zinc-100": path === link.href,
            }

          )}
          to={link.href}
        >
          <Icon className="h-4 w-4"/>
          {link.name}
        </Link>
      );
    });
  }

  return (
    <div className="flex-1">
      <nav className="grid items-start text-sm font-medium">
        {renderMenuLinks()}
      </nav>
    </div>
  )
}

export default NavList;
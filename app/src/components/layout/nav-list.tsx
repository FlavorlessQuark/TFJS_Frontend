import {Link} from "@tanstack/react-router";
import {Home} from "lucide-react";

const NavList = () => {

  const menuLinks = [
    {
      name: "Home",
      icon: Home,
      href: "/",
    },
  ];

  const renderMenuLinks = () => {
    return menuLinks.map((link) => {
      const Icon = link.icon;
      return (
        <Link
          key={link.name}
          href={link.href}
          className="hover:border-y flex items-center gap-3 px-6 py-2 text-muted-foreground transition-all hover:text-primary"
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
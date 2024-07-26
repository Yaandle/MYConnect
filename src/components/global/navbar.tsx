"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { UserButton } from "@clerk/nextjs";

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Orders",
    href: "/docs/primitives/alert-dialog",
    description: "A modal dialog that interrupts the user with important content and expects a response.",
  },
  {
    title: "Jobs",
    href: "/docs/primitives/hover-card",
    description: "For sighted users to preview content available behind a link.",
  },
  {
    title: "Profile",
    href: "/profile",
    description: "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
  }
];

export const Navbar: React.FC<{ username: string }> = ({ username }) => {
  return (
    <header className="fixed right-0 left-0 top-0 py-4 px-4 bg-white backdrop-blur-lg z-[100] flex items-center border-b-[1px] border-neutral-300 justify-between">
      <aside className="flex items-center gap-[2px]">
        <p className="text-3xl font-bold text-black">MY <span className="text-green-500">Connect</span></p>
      </aside>
      <nav className="flex-grow flex justify-center">
        <ul className="flex items-center gap-4 list-none">
          {/* Additional navigation items */}
        </ul>
      </nav>
      <aside className="flex items-center gap-4">
        <NavigationMenu>
          <NavigationMenuList className="flex flex-col md:flex-row">
            <NavigationMenuItem>
              <NavigationMenuTrigger>My Business</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <a
                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                        href="/"
                      >
                        <div className="mb-2 mt-4 text-lg font-medium">Orders</div>
                        <p className="text-sm leading-tight text-muted-foreground">
                          Keep track of your orders and deliveries. Manage everything at one place.
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <ListItem href={`/seller/${username}/manage-jobs`} title="Jobs">
                    Manage, create and edit your Jobs here.
                  </ListItem>
                  <ListItem href={`/${username}`} title="Profile">
                    Manage and edit your profile. Present yourself to the world.
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Advertising & Growth</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  {components.map((component) => (
                    <ListItem
                      key={component.title}
                      title={component.title}
                      href={component.href}
                    >
                      {component.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/docs" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Analytics
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <UserButton />
      </aside>
    </header>
  );
};

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export default Navbar;

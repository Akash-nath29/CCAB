import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import WalletConnect from "./WalletConnect";
import ThemeToggle from "./ThemeToggle";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Navigation() {
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const links = [
    { href: "/list", label: "Market" },
    { href: "/mint", label: "Mint" },
    { href: "/list-credit", label: "List Credit" }
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/">
              <a className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60 hover:to-primary/80 transition-colors">
                C cred
              </a>
            </Link>
            <div className="hidden md:ml-8 md:flex md:items-center md:space-x-4">
              {links.map(link => (
                <Link key={link.href} href={link.href}>
                  <a className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium transition-colors hover:scale-105 transform",
                    location === link.href
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}>
                    {link.label}
                  </a>
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <div className="hidden md:block">
              <WalletConnect />
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={cn(
        "md:hidden",
        isMenuOpen ? "block" : "hidden"
      )}>
        <div className="space-y-1 px-4 pb-3 pt-2">
          {links.map(link => (
            <Link key={link.href} href={link.href}>
              <a className={cn(
                "block px-3 py-2 rounded-md text-base font-medium transition-colors",
                location === link.href
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}>
                {link.label}
              </a>
            </Link>
          ))}
          <div className="pt-4">
            <WalletConnect />
          </div>
        </div>
      </div>
    </nav>
  );
}
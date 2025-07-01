import Link from "next/link";
import { MenuIcon } from "lucide-react";
import { Button } from "@/core/components/ui/button";
import Logo from "@/core/components/elements/logo";
import { ThemeToggle } from "@/core/components/theme/theme-toggle";

const routes = [
  { label: "Features", href: "#features" },
  { label: "Solutions", href: "#solutions" },
  { label: "Pricing", href: "#pricing" },
  { label: "Resources", href: "#resources" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-primary backdrop-blur-sm border-b">
      <div className="container flex items-center justify-between h-16 lg:h-20 pad">
        <Logo />

        <nav className="hidden md:flex items-center gap-8">
          {routes.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              className="text-foreground/80 hover:text-accent transition-colors text-lg font-medium"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2">
            <Link href="/login">
              <Button>Sign In</Button>
            </Link>
            <Link href="/register">
              <Button variant="secondary">Register</Button>
            </Link>
          </div>

          <Button variant="ghost" size="icon" className="md:hidden">
            <MenuIcon className="h-5 w-5" />
          </Button>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

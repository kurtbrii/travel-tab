import Image from "next/image";
import Link from "next/link";
import ThemeToggle from "@/components/theme-toggle";
import LogoutButton from "@/components/logout-button";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth";
import logo from "@/assets/travel-tab-logo.png";
import { User } from "lucide-react";

interface NavbarProps {
  context?: "home" | "trips";
}

export default async function Navbar({ context = "trips" }: NavbarProps) {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-20 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <Link href={context === "home" ? "/" : "/trips"} className="flex items-center gap-2">
          <Image
            src={logo}
            alt="Travel Tab logo"
            className="rounded-md"
            width={120}
            height={120}
            priority
          />
        </Link>
        <nav className="flex items-center gap-3">
          <ThemeToggle />
          {user ? (
            <>
              {context === "home" ? (
                <Button asChild size="sm" className="bg-primary text-primary-foreground">
                  <Link href="/trips">Trips</Link>
                </Button>
              ) : (
                <Button variant="ghost" size="sm" className="p-2" aria-label="User">
                  <User className="size-4" />
                </Button>
              )}
              <LogoutButton />
            </>
          ) : context === "home" ? (
            <>
              <Button asChild variant="ghost" size="sm" className="px-3">
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild size="sm" className="bg-primary text-primary-foreground">
                <Link href="/register">Get Started</Link>
              </Button>
            </>
          ) : null}
        </nav>
      </div>
    </header>
  );
}

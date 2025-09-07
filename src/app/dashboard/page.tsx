import Image from "next/image";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import logo from "@/assets/travel-tab-logo.png";
import ThemeToggle from "@/components/theme-toggle";
import LogoutButton from "@/components/logout-button";
import TripsGrid from "@/components/trips-grid";
import { User } from "lucide-react";
import { dummyTrips } from "@/constants/data";

export default async function Dashboard() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-2">
            <Image
              src={logo}
              alt="Travel Tab logo"
              className="rounded-md"
              width={120}
              height={120}
              priority
            />
          </div>
          <nav className="flex items-center gap-3">
            <ThemeToggle />
            <Button variant="ghost" size="sm" className="p-2">
              <User className="size-4" />
            </Button>
            <LogoutButton />
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {user.fullName}
          </h1>
          <p className="text-muted-foreground">
            Manage your travel plans and compliance requirements
          </p>
        </div>

        {/* Trips Grid (draggable) */}
        <TripsGrid initialTrips={dummyTrips} currentUserId={user.id} />
      </div>
    </main>
  );
}

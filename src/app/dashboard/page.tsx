import Image from "next/image";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import logo from "@/assets/travel-tab-logo.png";
import ThemeToggle from "@/components/theme-toggle";
import LogoutButton from "@/components/logout-button";
import { User, Plus, MapPin, Calendar } from "lucide-react";

// Dummy trip data
const dummyTrips = [
  {
    id: "1",
    title: "Tokyo Business Trip",
    destination: "Tokyo, Japan",
    startDate: "2024-03-15",
    endDate: "2024-03-22",
    status: "Planning" as const,
    statusColor:
      "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400",
    modules: ["BorderBuddy"],
  },
  {
    id: "2",
    title: "European Backpacking",
    destination: "Multiple Cities, Europe",
    startDate: "2024-06-01",
    endDate: "2024-06-30",
    status: "Ready to Go" as const,
    statusColor:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400",
    modules: ["BorderBuddy", "FlightTracker", "Accommodation"],
  },
];

function TripCard({ trip }: { trip: (typeof dummyTrips)[0] }) {
  return (
    <div className="card shadow-card hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-lg text-foreground">
            {trip.title}
          </h3>
          <div className="flex items-center gap-1 mt-1 text-muted-foreground">
            <MapPin className="size-4" />
            <span className="text-sm">{trip.destination}</span>
          </div>
        </div>
        <span
          className={cn(
            "px-2 py-1 rounded-full text-xs font-medium",
            trip.statusColor
          )}
        >
          {trip.status}
        </span>
      </div>

      <div className="flex items-center gap-1 mb-4 text-muted-foreground">
        <Calendar className="size-4" />
        <span className="text-sm">
          {new Date(trip.startDate).toLocaleDateString()} -{" "}
          {new Date(trip.endDate).toLocaleDateString()}
        </span>
      </div>

      <div className="mb-4">
        <p className="text-sm font-medium text-foreground mb-2">
          Active Modules:
        </p>
        <div className="flex flex-wrap gap-2">
          {trip.modules.map((module) => (
            <span
              key={module}
              className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs font-medium"
            >
              {module}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function AddTripCard() {
  return (
    <div className="card shadow-card hover:shadow-lg transition-all cursor-pointer group border-2 border-dashed border-border hover:border-primary/50 bg-accent/30 hover:bg-accent/50">
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center mb-4 transition-colors">
          <Plus className="size-8 text-primary" />
        </div>
        <h3 className="font-semibold text-foreground mb-2">Add New Trip</h3>
        <p className="text-sm text-muted-foreground">
          Start planning your next adventure
        </p>
      </div>
    </div>
  );
}

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

        {/* Trips Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AddTripCard />
          {dummyTrips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      </div>
    </main>
  );
}

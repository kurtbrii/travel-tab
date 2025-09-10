import { AuthService } from "@/server/services/auth.service";
import { redirect } from "next/navigation";
import TripsGrid from "@/components/trips-grid";
import { Suspense } from "react";
import Loading from "./loading";
import { getTripsByUser } from "@/lib/trips";
import Navbar from "@/components/navbar";

// Avoid caching; must evaluate auth on every request
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function Dashboard() {
  const user = await AuthService.getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch trips via domain service
  let trips = [] as any[];
  try {
    trips = await getTripsByUser(user.id);
  } catch (error) {
    console.error("Error fetching trips:", error);
    trips = [];
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar context="dashboard" />

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
        <Suspense fallback={<Loading />}>
          <TripsGrid initialTrips={trips} currentUserId={user.id} />
        </Suspense>
      </div>
    </main>
  );
}

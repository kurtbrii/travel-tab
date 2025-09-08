import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import TripsGrid from "@/components/trips-grid";
import { Suspense } from "react";
import Loading from "./loading";
import { prisma } from "@/lib/db";
import Navbar from "@/components/navbar";

// Map Prisma enum to display string used by UI
const toDisplayStatus = (status: string | null | undefined): string => {
  switch (status) {
    case "Ready_to_Go":
      return "Ready to Go";
    case "In_Progress":
      return "In Progress";
    case "Completed":
      return "Completed";
    case "Planning":
    default:
      return "Planning";
  }
};

export default async function Dashboard() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch trips directly via Prisma (avoid internal HTTP fetch/cookies issues)
  let trips = [] as any[];
  try {
    const rawTrips = await prisma.trip.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    trips = rawTrips.map((t) => ({
      id: t.id,
      title: t.title,
      destination: t.destination,
      // Serialize dates to strings for client components
      startDate: new Date(t.startDate).toISOString(),
      endDate: new Date(t.endDate).toISOString(),
      status: toDisplayStatus(t.status as any),
      statusColor:
        t.statusColor ||
        "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400",
      modules: Array.isArray(t.modules) ? t.modules : [],
      userId: t.userId,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
    }));
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

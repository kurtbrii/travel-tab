import TripSkeleton from "@/components/trips/trip-skeleton";
import NavbarSkeleton from "@/components/navbar-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="min-h-screen bg-background">
      <NavbarSkeleton />
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Welcome Section Skeleton to preserve spacing */}
        <div className="mb-8">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        {/* Trips Grid Skeleton matching layout */}
        <div className="grid auto-rows-fr gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <TripSkeleton key={i} />
          ))}
        </div>
      </div>
    </main>
  );
}

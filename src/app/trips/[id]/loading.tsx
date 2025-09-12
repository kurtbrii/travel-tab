import NavbarSkeleton from "@/components/navbar-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="min-h-screen bg-background">
      <NavbarSkeleton />

      <div className="mx-auto max-w-5xl px-6 py-6">
        {/* Back link placeholder */}
        <div className="mb-4">
          <Skeleton className="h-4 w-28" />
        </div>

        {/* Sticky header card skeleton */}
        <section className="card shadow-card p-4 md:p-6 sticky top-[4.5rem] z-10 bg-background/95 backdrop-blur border border-border/60">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-64" />
              <div className="mt-2 flex gap-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        </section>

        {/* Tabs and content skeleton */}
        <section className="mt-6">
          <div className="mb-4 flex gap-2">
            <Skeleton className="h-9 w-24 rounded-md" />
            <Skeleton className="h-9 w-32 rounded-md" />
          </div>
          <div className="card shadow-card p-4 md:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-4 w-40" />
              </div>
              <div>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-4 w-40" />
              </div>
              <div>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-4 w-36" />
              </div>
              <div>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-4 w-36" />
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}


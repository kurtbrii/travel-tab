import { Skeleton } from "@/components/ui/skeleton";

export default function TripSkeleton() {
  return (
    <div className="card shadow-card h-full min-h-[260px]">
      <div className="flex items-start justify-between mb-4">
        <div>
          <Skeleton className="h-4 w-40 mb-2" />
          <Skeleton className="h-3 w-24" />
        </div>
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <div className="flex items-center gap-2 mb-4">
        <Skeleton className="h-4 w-4 rounded" />
        <Skeleton className="h-3 w-32" />
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-5 w-14" />
      </div>
    </div>
  );
}

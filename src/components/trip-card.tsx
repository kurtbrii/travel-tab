"use client";

import { MapPin, Calendar, ClipboardList } from "lucide-react";
import { useRouter } from "next/navigation";
import StatusBadge from "@/components/ui/status-badge";
import { Trip } from "@/types";
import { toCountryName } from "@/lib/iso-countries";

interface TripCardProps {
  trip: Trip;
}

function TripCard({ trip }: TripCardProps) {
  const router = useRouter();

  const handleTripClick = () => {
    const search = typeof window !== 'undefined' ? window.location.search : '';
    const returnTo = search ? `/trips${search}` : '';
    const href = returnTo
      ? `/trips/${encodeURIComponent(trip.id)}?returnTo=${encodeURIComponent(returnTo)}`
      : `/trips/${encodeURIComponent(trip.id)}`;
    router.push(href);
  };

  return (
    <button
      onClick={handleTripClick}
      className="card shadow-card hover:shadow-lg transition-all w-full h-full min-h-[260px] text-left cursor-pointer hover:scale-[1.005] active:scale-[0.99] animate-in fade-in-0"
      aria-label={`View details for trip to ${toCountryName(trip.destinationCountry)}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <MapPin className="size-4" />
            <span className="text-sm">{toCountryName(trip.destinationCountry)}</span>
          </div>
          <div className="flex items-center gap-1 mt-1 text-foreground">
            <ClipboardList className="size-4" />
            <span className="text-sm font-medium">{trip.purpose}</span>
          </div>
        </div>
        <StatusBadge status={trip.status} />
      </div>

      <div className="flex items-center gap-1 mb-4 text-muted-foreground">
        <Calendar className="size-4" />
        <span className="text-sm">
          {new Date(trip.startDate).toISOString().slice(0, 10)} -{" "}
          {new Date(trip.endDate).toISOString().slice(0, 10)}
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
    </button>
  );
}

export default TripCard;

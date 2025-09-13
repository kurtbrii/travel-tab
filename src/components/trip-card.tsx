"use client";

import { MapPin, Calendar, ClipboardList } from "lucide-react";
import { useRouter } from "next/navigation";
import StatusBadge from "@/components/ui/status-badge";
import { Trip } from "@/types";
import { ReactNode } from "react";
import { toCountryName } from "@/lib/iso-countries";

interface TripCardProps {
  trip: Trip;
  trailingActions?: ReactNode;
}

function TripCard({ trip, trailingActions }: TripCardProps) {
  const router = useRouter();

  const handleTripClick = () => {
    const search = typeof window !== "undefined" ? window.location.search : "";
    const returnTo = search ? `/trips${search}` : "";
    const href = returnTo
      ? `/trips/${encodeURIComponent(trip.id)}?returnTo=${encodeURIComponent(
          returnTo
        )}`
      : `/trips/${encodeURIComponent(trip.id)}`;
    router.push(href);
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    // Only activate when the card itself is focused. Prevent triggering
    // from bubbled key events (e.g., inputs inside portals like modals).
    const isCardFocused = e.currentTarget === document.activeElement;
    const isActivationKey = e.key === "Enter" || e.key === " ";
    if (isCardFocused && isActivationKey) {
      e.preventDefault();
      handleTripClick();
    }
  };

  return (
    <div
      onClick={handleTripClick}
      onKeyDown={onKeyDown}
      role="button"
      tabIndex={0}
      className="card shadow-card hover:shadow-lg transition-all w-full h-full min-h-[230px] text-left cursor-pointer hover:scale-[1.005] active:scale-[0.99] animate-in fade-in-0"
      aria-label={`View details for trip to ${toCountryName(
        trip.destinationCountry
      )}`}
    >
      <div className="flex items-start justify-between mb-3 gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-1 text-muted-foreground min-w-0">
            <MapPin className="size-4" />
            <span className="text-sm truncate">
              {toCountryName(trip.destinationCountry)}
            </span>
          </div>
          <div className="flex items-center gap-1 mt-1 text-foreground min-w-0">
            <ClipboardList className="size-4" />
            <span className="text-sm font-medium truncate" title={trip.purpose}>
              {trip.purpose}
            </span>
          </div>
        </div>
        <div className="shrink-0 flex items-center gap-2">
          <StatusBadge status={trip.status} />
          {trailingActions}
        </div>
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
    </div>
  );
}

export default TripCard;

"use client";

import { MapPin, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { Trip } from "@/types";

interface TripCardProps {
  trip: Trip;
}

function TripCard({ trip }: TripCardProps) {
  const handleTripClick = () => {
    // TODO: Implement trip detail view/navigation
    alert(`Trip details for "${trip.title}" coming soon!`);
  };

  return (
    <button
      onClick={handleTripClick}
      className="card shadow-card hover:shadow-lg transition-shadow w-full text-left cursor-pointer"
      aria-label={`View details for ${trip.title} trip to ${trip.destination}`}
    >
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
    </button>
  );
}

// Ensure the component is exported
export default TripCard;

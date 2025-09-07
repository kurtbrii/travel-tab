"use client";

import type { CSSProperties } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import TripCard from "@/components/trip-card";
import { Trip } from "@/types";

export default function SortableTrip({ trip }: { trip: Trip }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: trip.id });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 30 : undefined,
    opacity: isDragging ? 0.5 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TripCard trip={trip} />
    </div>
  );
}



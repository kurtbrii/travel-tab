"use client";

import type { CSSProperties } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import TripCard from "@/components/trip-card";
import { Trip } from "@/types";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import DeleteTripModal from "@/components/delete-trip/delete-trip-modal";
import { Button } from "@/components/ui/button";

export default function SortableTrip({ trip, onDeleted }: { trip: Trip; onDeleted?: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: trip.id });
  const [open, setOpen] = useState(false);

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 30 : undefined,
    opacity: isDragging ? 0.5 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TripCard
        trip={trip}
        trailingActions={
          <Button
            variant="outline"
            size="sm"
            aria-label="Delete trip"
            title="Delete trip"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpen(true); }}
          >
            <Trash2 className="size-4" />
          </Button>
        }
      />
      <DeleteTripModal
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={async () => {
          try {
            const res = await fetch(`/api/trips/${encodeURIComponent(trip.id)}`, { method: 'DELETE' });
            if (res.status === 204 || res.ok || res.status === 404) {
              onDeleted?.(trip.id);
              setOpen(false);
            } else if (res.status === 403) {
              setOpen(false);
              // Non-blocking: could surface toast; keep minimal feedback per request
            }
          } catch (err) {
            console.error('Delete trip failed', err);
          }
        }}
        trip={{
          destinationCountry: trip.destinationCountry,
          purpose: trip.purpose,
          startDate: trip.startDate,
          endDate: trip.endDate,
        }}
      />
    </div>
  );
}

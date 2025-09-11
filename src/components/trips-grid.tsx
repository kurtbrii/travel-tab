"use client";

import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import TripCard from "@/components/trip-card";
import { AddTripCard } from "@/components/add-trip-card";
import { Trip } from "@/types";
import TripSkeleton from "@/components/trips/trip-skeleton";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import SortableTrip from "@/components/trips/sortable-trip";

interface TripsGridProps {
  initialTrips: Trip[];
  currentUserId: string;
}

export default function TripsGrid({
  initialTrips,
  currentUserId,
}: TripsGridProps) {
  const [trips, setTrips] = useState<Trip[]>(initialTrips);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [flash, setFlash] = useState<string | null>(null);

  // LocalStorage persistence
  const STORAGE_KEY = "travel-tab:tripsOrder:v1";

  const applySavedOrder = (list: Trip[], order: string[]) => {
    if (!Array.isArray(order) || order.length === 0) return list;
    const indexMap = new Map(order.map((id, i) => [String(id), i] as const));
    // Sort by saved order first, then fallback to original order
    return [...list].sort((a, b) => {
      const ia = indexMap.get(String(a.id));
      const ib = indexMap.get(String(b.id));
      if (ia === undefined && ib === undefined) return 0;
      if (ia === undefined) return 1; // unknown ids go after known
      if (ib === undefined) return -1;
      return ia - ib;
    });
  };

  const saveOrder = (list: Trip[]) => {
    try {
      const order = list.map((t) => String(t.id));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(order));
    } catch {}
  };

  // Read saved order and apply before showing the grid, to avoid visual jump
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const order = raw ? JSON.parse(raw) : undefined;
      if (order) {
        setTrips(applySavedOrder(initialTrips, order));
      } else {
        setTrips(initialTrips);
      }
    } catch {
      setTrips(initialTrips);
    } finally {
      setMounted(true);
    }
  }, [initialTrips]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const items = useMemo(() => trips.map((t) => t.id), [trips]);
  const activeTrip = useMemo(
    () => trips.find((t) => t.id === activeId) || null,
    [activeId, trips]
  );

  const onDragStart = (event: DragStartEvent) => {
    const id = String(event.active.id);
    setActiveId(id);
  };

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    const oldIndex = trips.findIndex((t) => t.id === active.id);
    const newIndex = trips.findIndex((t) => t.id === over.id);
    if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
      setTrips((prev) => {
        const next = arrayMove(prev, oldIndex, newIndex);
        // Persist order after successful reorder
        saveOrder(next);
        return next;
      });
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <div className="grid auto-rows-fr gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mounted ? (
          <>
            <SortableContext items={items} strategy={rectSortingStrategy}>
              {trips.map((trip) => (
                <div key={trip.id} className="h-full animate-in fade-in-0 zoom-in-95">
                  <SortableTrip trip={trip} />
                </div>
              ))}
            </SortableContext>
            <div className="h-full">
              <AddTripCard
                currentUserId={currentUserId}
                onAddTrip={(t) => {
                  setTrips((prev) => [...prev, t])
                  setFlash('Trip created successfully')
                  setTimeout(() => setFlash(null), 2500)
                }}
              />
            </div>
          </>
        ) : (
          <>
            {Array.from({ length: 6 }).map((_, i) => (
              <TripSkeleton key={i} />
            ))}
          </>
        )}
      </div>

      {flash && (
        <div role="status" className="mt-6 p-3 rounded-md bg-success/15 text-success text-sm">
          {flash}
        </div>
      )}

      {/* Floating preview while dragging */}
      <DragOverlay
        dropAnimation={{ duration: 150, easing: "cubic-bezier(.2,.8,.2,1)" }}
      >
        {activeTrip ? (
          <div className="scale-[1.02] shadow-2xl">
            <TripCard trip={activeTrip} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

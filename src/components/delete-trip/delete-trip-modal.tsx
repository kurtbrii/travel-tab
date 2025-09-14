"use client";

import React from "react";
import AddTripModal from "@/components/add-trip/add-trip-modal";
import { Calendar, ClipboardList, MapPin, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toCountryName } from "@/lib/iso-countries";

interface DeleteTripModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  confirmDisabled?: boolean;
  trip?: {
    purpose?: string;
    destinationCountry?: string;
    startDate?: string;
    endDate?: string;
  };
}

export default function DeleteTripModal({ open, onClose, onConfirm, confirmDisabled, trip }: DeleteTripModalProps) {
  const destination = trip?.destinationCountry ? toCountryName(trip.destinationCountry) : undefined
  const fmt = (iso?: string) => {
    if (!iso) return ''
    try {
      const d = new Date(iso)
      if (isNaN(d.getTime())) return String(iso)
      return d.toISOString().slice(0, 10)
    } catch {
      return String(iso)
    }
  }

  return (
    <AddTripModal
      open={open}
      onClose={onClose}
      ariaLabelledBy="delete-trip-heading"
      header={
        <div className="px-5 pt-5">
          <h2 id="delete-trip-heading" className="text-lg font-semibold">
            Delete trip and related data?
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            This action permanently removes the trip and related data. This cannot be undone.
          </p>
        </div>
      }
      footer={
        <div className="px-5 pb-5 pt-3 flex items-center justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="destructive" onClick={onConfirm} disabled={confirmDisabled}>
            <Trash2 className="size-4" /> Delete
          </Button>
        </div>
      }
    >
      <div className="p-5 space-y-3">
        {destination && (
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="size-4 text-muted-foreground" />
            <span className="text-muted-foreground">Destination</span>
            <span className="font-medium">{destination}</span>
          </div>
        )}
        {trip?.purpose && (
          <div className="flex items-center gap-2 text-sm">
            <ClipboardList className="size-4 text-muted-foreground" />
            <span className="text-muted-foreground">Purpose</span>
            <span className="font-medium">{trip.purpose}</span>
          </div>
        )}
        {trip?.startDate && trip?.endDate && (
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="size-4 text-muted-foreground" />
            <span className="text-muted-foreground">Dates</span>
            <span className="font-medium font-mono">{fmt(trip.startDate)} – {fmt(trip.endDate)}</span>
          </div>
        )}
      </div>
    </AddTripModal>
  );
}

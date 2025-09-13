"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import DeleteTripModal from "@/components/delete-trip/delete-trip-modal";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export default function DeleteTripButton({ tripId }: { tripId: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [open, setOpen] = useState(false);

  const onConfirm = () => {
    start(async () => {
      try {
        const res = await fetch(`/api/trips/${encodeURIComponent(tripId)}`, {
          method: "DELETE",
        });
        if (res.status === 204 || res.ok) {
          router.push("/trips?flash=Trip%20deleted%20successfully");
        }
      } finally {
        setOpen(false);
      }
    });
  };

  return (
    <>
      <Button variant="destructive" size="sm" onClick={() => setOpen(true)} disabled={pending}>
        <Trash2 className="size-4" /> Delete Trip
      </Button>
      <DeleteTripModal open={open} onClose={() => setOpen(false)} onConfirm={onConfirm} />
    </>
  );
}

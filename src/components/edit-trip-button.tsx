"use client";

import React from "react";
import { useCallback, useMemo, useState } from "react";
import { Pencil, Loader2 } from "lucide-react";
import AddTripModal from "@/components/add-trip/add-trip-modal";
import AddTripForm from "@/components/add-trip/add-trip-form";
import { tripSchema } from "@/lib/validation";
import type { Trip } from "@/types";
import { useRouter } from "next/navigation";
import Toast from "@/components/ui/toast";

export default function EditTripButton({
  trip,
  variant = "text",
}: {
  trip: Trip;
  variant?: "icon" | "text";
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [purpose, setPurpose] = useState(trip.purpose || "");
  const [destinationCountry, setDestinationCountry] = useState(
    trip.destinationCountry || ""
  );
  const [startDate, setStartDate] = useState(
    new Date(trip.startDate).toISOString().slice(0, 10)
  );
  const [endDate, setEndDate] = useState(
    new Date(trip.endDate).toISOString().slice(0, 10)
  );
  const [errors, setErrors] = useState<{ [k: string]: string | undefined }>({});
  const [touched, setTouched] = useState<{ [k: string]: boolean }>({});
  const [isSaving, setIsSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [toastVariant, setToastVariant] = useState<
    "success" | "error" | "warning" | "info"
  >("success");

  const isValid = useMemo(() => {
    const result = tripSchema.safeParse({
      destinationCountry,
      purpose,
      startDate,
      endDate,
    });
    return result.success;
  }, [destinationCountry, purpose, startDate, endDate]);

  const handleFieldBlur = useCallback((field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }, []);

  const reset = useCallback(() => {
    setPurpose(trip.purpose || "");
    setDestinationCountry((trip.destinationCountry || "").toUpperCase());
    setStartDate(new Date(trip.startDate).toISOString().slice(0, 10));
    setEndDate(new Date(trip.endDate).toISOString().slice(0, 10));
    setErrors({});
    setTouched({});
  }, [trip]);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    setTouched({
      destinationCountry: true,
      purpose: true,
      startDate: true,
      endDate: true,
    });
    const result = tripSchema.safeParse({
      destinationCountry,
      purpose,
      startDate,
      endDate,
    });
    if (!result.success) {
      const fieldErrors: { [k: string]: string } = {};
      for (const issue of result.error.issues) {
        const path = issue.path[0] as string;
        fieldErrors[path] = issue.message;
      }
      setErrors(fieldErrors);
      setIsSaving(false);
      return;
    }

    try {
      const response = await fetch(
        `/api/trips/${encodeURIComponent(trip.id)}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            destinationCountry: destinationCountry.trim(),
            purpose: purpose.trim(),
            startDate,
            endDate,
            status: trip.status, // keep current unless changed later in UI
          }),
        }
      );

      if (!response.ok) {
        let serverMessage = "";
        try {
          const data = await response.json();
          serverMessage =
            (data?.error as string) ||
            (data?.message as string) ||
            (data?.details as string) ||
            "";
        } catch {}
        if (response.status === 401) {
          setToastVariant("error");
          setToastMsg("Please sign in to edit this trip.");
        } else if (response.status === 403) {
          setToastVariant("error");
          setToastMsg("You do not have permission to edit this trip.");
        } else if (response.status === 404) {
          setToastVariant("warning");
          setToastMsg("Trip not found. It may have been deleted.");
        } else if (response.status === 400) {
          if (/country/i.test(serverMessage)) {
            setErrors((prev) => ({
              ...prev,
              destinationCountry: serverMessage || "Invalid country code",
            }));
          }
          setToastVariant("warning");
          setToastMsg(serverMessage || "Missing or invalid fields.");
        } else {
          setToastVariant("error");
          setToastMsg(serverMessage || "Failed to update trip.");
        }
        return;
      }

      setToastVariant("success");
      setToastMsg("Trip updated successfully");
      setOpen(false);
      router.refresh();
    } catch (err) {
      console.error("Error updating trip:", err);
      setToastVariant("error");
      setToastMsg("Unexpected error updating trip.");
    } finally {
      setIsSaving(false);
    }
  }, [
    destinationCountry,
    endDate,
    purpose,
    startDate,
    trip.id,
    trip.status,
    router,
  ]);

  return (
    <>
      <Toast
        open={!!toastMsg}
        message={toastMsg}
        onClose={() => setToastMsg(null)}
        variant={toastVariant}
      />
      {variant === "icon" ? (
        <button
          type="button"
          className="cursor-pointer text-muted-foreground border border-border hover:text-foreground hover:bg-accent/10 hover:border-foreground/30 transition-colors rounded-md p-2"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setOpen(true);
          }}
          aria-label="Edit trip"
          title="Edit trip"
        >
          <Pencil className="size-4" />
        </button>
      ) : (
        <button
          type="button"
          className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-md border border-border hover:bg-accent/40 transition-colors"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setOpen(true);
          }}
          aria-label="Edit trip"
          title="Edit trip"
        >
          <Pencil className="size-4" /> Edit
        </button>
      )}

      <AddTripModal
        open={open}
        onClose={() => {
          setOpen(false);
          reset();
        }}
        header={
          <div className="px-5 py-4 border-b border-border">
            <h2
              id="edit-trip-title"
              className="text-xl font-semibold text-foreground"
            >
              Edit Trip
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Update destination, purpose, and dates
            </p>
          </div>
        }
        ariaLabelledBy="edit-trip-title"
        footer={
          <div className="flex justify-end gap-3 px-5 py-4 border-t border-border">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                reset();
              }}
              className="px-4 py-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!isValid || isSaving}
              className={`px-4 py-2 text-sm font-medium text-white rounded-md transition-colors bg-primary ${
                !isValid || isSaving
                  ? "opacity-60 cursor-not-allowed"
                  : "hover:bg-primary/90"
              }`}
            >
              {isSaving ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="size-4 animate-spin" />
                  Saving...
                </span>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        }
      >
        <AddTripForm
          purpose={purpose}
          destinationCountry={destinationCountry}
          startDate={startDate}
          endDate={endDate}
          errors={errors}
          touched={touched}
          onFieldBlur={handleFieldBlur}
          onChange={{
            setPurpose,
            setDestinationCountry,
            setStartDate,
            setEndDate,
            setErrors,
          }}
        />
      </AddTripModal>
    </>
  );
}

"use client";

import { useState, useCallback, useMemo } from "react";
import { Plus } from "lucide-react";
import AddTripModal from "@/components/add-trip/add-trip-modal";
import AddTripForm from "@/components/add-trip/add-trip-form";
import { Trip } from "@/types";
import { tripSchema } from "@/lib/validation";

interface AddTripCardProps {
  onAddTrip: (trip: Trip) => void;
  currentUserId: string;
}

export function AddTripCard({ onAddTrip, currentUserId }: AddTripCardProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [errors, setErrors] = useState<{ [k: string]: string | undefined }>({});
  const [touched, setTouched] = useState<{ [k: string]: boolean }>({});

  // Check if the form is valid
  const isValid = useMemo(() => {
    const result = tripSchema.safeParse({
      title,
      destination,
      startDate,
      endDate,
    });
    return result.success;
  }, [title, destination, startDate, endDate]);

  const reset = useCallback(() => {
    setTitle("");
    setDestination("");
    setStartDate("");
    setEndDate("");
    setErrors({});
    setTouched({});
  }, []);

  const handleFieldBlur = useCallback((field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }, []);

  const handleSubmit = useCallback(async () => {
    // Mark all fields as touched to show errors
    const allTouched = {
      title: true,
      destination: true,
      startDate: true,
      endDate: true,
    };
    setTouched(allTouched);

    const result = tripSchema.safeParse({
      title,
      destination,
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
      return;
    }

    const newTrip: Trip = {
      id: String(Date.now()),
      title: title.trim(),
      destination: destination.trim(),
      startDate,
      endDate,
      status: "Planning",
      statusColor:
        "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400",
      modules: [],
      userId: currentUserId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    onAddTrip(newTrip);
    setOpen(false);
    reset();
  }, [title, destination, startDate, endDate, currentUserId, onAddTrip, reset]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="card shadow-card hover:shadow-lg cursor-pointer group border-2 border-dashed border-border hover:border-primary/50 bg-accent/30 hover:bg-accent/50 w-full h-full min-h-[260px] text-left"
        aria-label="Add new trip"
      >
        <div className="flex h-full flex-col items-center justify-center py-8 text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center mb-4 transition-colors">
            <Plus className="size-8 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground mb-2">Add New Trip</h3>
          <p className="text-sm text-muted-foreground">
            Start planning your next adventure
          </p>
        </div>
      </button>

      <AddTripModal
        open={open}
        onClose={() => {
          setOpen(false);
          reset();
        }}
        header={
          <div className="px-5 py-4 border-b border-border">
            <h2 className="text-xl font-semibold text-foreground">
              Plan a New Trip
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Fill in the details to start planning your adventure
            </p>
          </div>
        }
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
              onClick={handleSubmit}
              disabled={!isValid}
              className={`px-4 py-2 text-sm font-medium text-white rounded-md transition-colors bg-primary ${!isValid ? 'opacity-60 cursor-not-allowed' : 'hover:bg-primary/90'}`}
            >
              Create Trip
            </button>
          </div>
        }
      >
        <AddTripForm
          title={title}
          destination={destination}
          startDate={startDate}
          endDate={endDate}
          errors={errors}
          touched={touched}
          onFieldBlur={handleFieldBlur}
          onChange={{
            setTitle,
            setDestination,
            setStartDate,
            setEndDate,
            setErrors,
          }}
        />
      </AddTripModal>
    </>
  );
}

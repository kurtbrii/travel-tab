"use client";

import { Plus } from "lucide-react";

export function AddTripCard() {
  const handleAddTrip = () => {
    // TODO: Implement trip creation modal/form
    alert("Trip creation feature coming soon!");
  };

  return (
    <button
      onClick={handleAddTrip}
      className="card shadow-card hover:shadow-lg transition-all cursor-pointer group border-2 border-dashed border-border hover:border-primary/50 bg-accent/30 hover:bg-accent/50 w-full text-left"
      aria-label="Add new trip"
    >
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center mb-4 transition-colors">
          <Plus className="size-8 text-primary" />
        </div>
        <h3 className="font-semibold text-foreground mb-2">Add New Trip</h3>
        <p className="text-sm text-muted-foreground">
          Start planning your next adventure
        </p>
      </div>
    </button>
  );
}

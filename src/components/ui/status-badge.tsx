"use client";

import { cn } from "@/lib/utils";
import { TripStatus } from "@/types";

interface StatusBadgeProps {
  status: TripStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const paletteClass =
    status === "Planning"
      ? "bg-secondary/20 text-secondary"
      : status === "Ready to Go"
      ? "bg-success/20 text-success"
      : status === "In Progress"
      ? "bg-primary/15 text-primary"
      : "bg-foreground/10 text-foreground"; // Completed

  return (
    <span
      className={cn(
        "px-2 py-1 rounded-full text-xs font-medium cursor-pointer",
        paletteClass,
        className
      )}
    >
      {status}
    </span>
  );
}

export default StatusBadge;

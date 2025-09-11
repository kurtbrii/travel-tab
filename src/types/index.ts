// User types
export interface User {
  id: string;
  email: string;
  fullName: string;
  createdAt: Date;
  updatedAt: Date;
}

// Trip types
export interface Trip {
  id: string;
  // Story-aligned fields
  purpose: string;
  destinationCountry: string; // ISO alpha-2
  // Legacy display fields (kept for compatibility where needed)
  title?: string;
  destination?: string;
  startDate: string;
  endDate: string;
  status: TripStatus;
  statusColor: string;
  modules: string[];
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type TripStatus = "Planning" | "Ready to Go" | "In Progress" | "Completed";

// Component prop types
export interface IconProps {
  className?: string;
  size?: number;
}

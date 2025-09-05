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
  title: string;
  destination: string;
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
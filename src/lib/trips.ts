import { prisma } from "@/lib/db";
import type { Trip as TripType } from "@/types";
import { tripSchema } from "@/lib/validation";
import { toCountryName, isValidAlpha2 } from "@/lib/iso-countries";

// Status mapping between DB enum and UI strings
export const toDisplayStatus = (status: string | null | undefined): TripType["status"] => {
  switch (status) {
    case "Ready_to_Go":
      return "Ready to Go";
    case "In_Progress":
      return "In Progress";
    case "Completed":
      return "Completed";
    case "Planning":
    default:
      return "Planning";
  }
};

export const fromDisplayStatus = (status: string | null | undefined): string => {
  switch (status) {
    case "Ready to Go":
      return "Ready_to_Go";
    case "In Progress":
      return "In_Progress";
    case "Completed":
      return "Completed";
    case "Planning":
    default:
      return "Planning";
  }
};

// Serialize Prisma Trip to UI Trip type
export function serializeTrip(t: any): TripType {
  return {
    id: t.id,
    // New fields with fallbacks for legacy data
    purpose: t.purpose || t.title || "",
    destinationCountry: (t.destinationCountry || t.destination || "").toString(),
    startDate: new Date(t.startDate).toISOString(),
    endDate: new Date(t.endDate).toISOString(),
    status: toDisplayStatus(t.status as any),
    statusColor:
      t.statusColor ||
      "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400",
    modules: Array.isArray(t.modules) ? t.modules : [],
    userId: t.userId,
    createdAt: t.createdAt,
    updatedAt: t.updatedAt,
  } as TripType;
}

// Read operations
export async function getTripsByUser(userId: string): Promise<TripType[]> {
  const trips = await prisma.trip.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
  return trips.map(serializeTrip);
}

// Read single trip by id
export async function getTripById(id: string): Promise<TripType | null> {
  const trip = await prisma.trip.findUnique({ where: { id } });
  return trip ? serializeTrip(trip) : null;
}

// Create operation
export interface CreateTripInput {
  destinationCountry: string; // ISO alpha-2
  purpose: string;            // 3-100 chars
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  status?: TripType["status"];
  statusColor?: string;
  modules?: string[];
}

export async function createTrip(userId: string, input: CreateTripInput): Promise<TripType> {
  // Validate base fields using zod schema (same as client form)
  const parsed = tripSchema.safeParse(input);
  if (!parsed.success) {
    const message = parsed.error.issues?.[0]?.message || "Invalid trip data";
    throw new Error(message);
  }
  if (!isValidAlpha2(parsed.data.destinationCountry)) {
    throw new Error("Invalid destination country code.");
  }

  const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!isoDateRegex.test(input.startDate) || !isoDateRegex.test(input.endDate)) {
    throw new Error("Invalid date format. Use YYYY-MM-DD.");
  }
  const start = new Date(`${input.startDate}T00:00:00.000Z`);
  const end = new Date(`${input.endDate}T00:00:00.000Z`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    throw new Error("Invalid date values.");
  }
  if (end < start) {
    throw new Error("End date must be after start date");
  }

  const created = await prisma.trip.create({
    data: {
      // Keep legacy fields populated for backward compatibility
      title: input.purpose.trim(),
      destination: toCountryName(input.destinationCountry.trim()),
      // New fields per story
      purpose: input.purpose.trim(),
      destinationCountry: input.destinationCountry.trim().toUpperCase(),
      startDate: start,
      endDate: end,
      statusColor:
        input.statusColor ||
        "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400",
      modules: input.modules || [],
      userId,
    },
  });

  return serializeTrip(created);
}

// Delete operation (hard delete)
export async function deleteTripById(id: string): Promise<void> {
  await prisma.trip.delete({ where: { id } });
}

// Update operation
export interface UpdateTripInput {
  destinationCountry: string;
  purpose: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  status?: TripType["status"]; // optional edit of status
}

export async function updateTrip(id: string, input: UpdateTripInput): Promise<TripType> {
  // Validate fields using same zod schema as creation
  const parsed = tripSchema.safeParse(input);
  if (!parsed.success) {
    const message = parsed.error.issues?.[0]?.message || "Invalid trip data";
    throw new Error(message);
  }
  if (!isValidAlpha2(parsed.data.destinationCountry)) {
    throw new Error("Invalid destination country code.");
  }

  const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!isoDateRegex.test(input.startDate) || !isoDateRegex.test(input.endDate)) {
    throw new Error("Invalid date format. Use YYYY-MM-DD.");
  }
  const start = new Date(`${input.startDate}T00:00:00.000Z`);
  const end = new Date(`${input.endDate}T00:00:00.000Z`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    throw new Error("Invalid date values.");
  }
  if (end < start) {
    throw new Error("End date must be after start date");
  }

  const updated = await prisma.trip.update({
    where: { id },
    data: {
      // Keep legacy fields populated for backward compatibility
      title: input.purpose.trim(),
      destination: toCountryName(input.destinationCountry.trim()),
      // Core fields per story
      purpose: input.purpose.trim(),
      destinationCountry: input.destinationCountry.trim().toUpperCase(),
      startDate: start,
      endDate: end,
    },
  });

  return serializeTrip(updated);
}

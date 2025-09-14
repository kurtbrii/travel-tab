import React from "react";
import { notFound } from "next/navigation";
import Navbar from "@/components/navbar";
import Tabs from "@/components/ui/tabs";
import StatusBadge from "@/components/ui/status-badge";
import { getCurrentUser } from "@/lib/auth";
import { getTripById } from "@/lib/trips";
import { toCountryName } from "@/lib/iso-countries";
import Link from "next/link";
import BackLink from "@/components/back-link";
import { unstable_noStore as noStore } from "next/cache";
import DeleteTripButton from "@/components/delete-trip-button";
import EditTripButton from "@/components/edit-trip-button";

// Disable caching for personalized SSR content
export const dynamic = "force-dynamic";

function formatDate(dateIso: string) {
  try {
    return new Date(dateIso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  } catch {
    return dateIso?.slice(0, 10);
  }
}

export default async function TripDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // Ensure no caching in any runtime cache for this request
  noStore();
  const user = await getCurrentUser();
  const { id } = await params;
  const trip = await getTripById(id);

  if (!trip || !user || trip.userId !== user.id) {
    notFound();
  }

  const sp = await searchParams;
  const returnTo = typeof sp?.returnTo === "string" ? sp.returnTo : undefined;
  // Basic sanitization – only allow internal trips URL
  const backHref = returnTo && returnTo.startsWith("/trips") ? returnTo : "/trips";

  const destinationName = toCountryName(trip.destinationCountry);

  return (
    <main className="min-h-screen bg-background">
      <Navbar context="trips" />

      <div className="mx-auto max-w-5xl px-6 py-6">
        <div className="mb-4">
          <BackLink
            href={backHref}
            className="text-sm text-muted-foreground hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
          >
            ← Back to Trips
          </BackLink>
        </div>

        {/* Sticky-ish header card with summary */}
        <section className="card shadow-card p-4 md:p-6 sticky top-[4.5rem] z-10 bg-background/95 backdrop-blur border border-border/60">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="h3 font-semibold leading-tight">{destinationName}</h1>
              <p className="text-sm text-muted-foreground mt-1">{trip.purpose}</p>
              <p className="text-sm mt-2">
                <span className="font-mono">{formatDate(trip.startDate)}</span>
                {" "}–{" "}
                <span className="font-mono">{formatDate(trip.endDate)}</span>
              </p>
            </div>
            <div className="shrink-0 flex items-center gap-3">
              <StatusBadge status={trip.status} />
              <EditTripButton trip={trip} />
              <DeleteTripButton tripId={trip.id} />
            </div>
          </div>
        </section>

        {/* Tabs */}
        <section className="mt-6">
          <Tabs
            initialTabId="overview"
            tabs={[
              {
                id: "overview",
                label: "Overview",
                content: (
                  <div className="card shadow-card p-4 md:p-6">
                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                      <div>
                        <dt className="text-sm text-muted-foreground">Destination</dt>
                        <dd className="text-sm font-medium">{destinationName}</dd>
                      </div>
                      <div>
                        <dt className="text-sm text-muted-foreground">Purpose</dt>
                        <dd className="text-sm font-medium">{trip.purpose}</dd>
                      </div>
                      <div>
                        <dt className="text-sm text-muted-foreground">Start Date</dt>
                        <dd className="text-sm font-medium font-mono">{formatDate(trip.startDate)}</dd>
                      </div>
                      <div>
                        <dt className="text-sm text-muted-foreground">End Date</dt>
                        <dd className="text-sm font-medium font-mono">{formatDate(trip.endDate)}</dd>
                      </div>
                    </dl>
                  </div>
                ),
              },
            ]}
          />
        </section>
      </div>
    </main>
  );
}

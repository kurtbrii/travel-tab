// Reuse the Dashboard page for the /trips route
import Dashboard from "@/app/dashboard/page";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function TripsPage() {
  return <Dashboard />;
}


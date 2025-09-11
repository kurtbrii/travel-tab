import { appVersion } from '@/lib/version'

// Build the health payload server-side to avoid an internal fetch
// that may fail due to dev server nuances.
function getHealthDirect() {
  const data = {
    status: 'ok' as const,
    env: process.env.NODE_ENV ?? 'development',
    version: appVersion,
    timestamp: new Date().toISOString(),
  }
  return { success: true, data }
}

export default async function HealthPage() {
  const health = getHealthDirect()
  const data = health.data

  return (
    <main className="mx-auto max-w-2xl p-6">
      <header className="mb-6">
        <h1 className="h2">System Health</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Quick status for deployability and environment metadata
        </p>
      </header>

      <section className="card shadow-card border border-border">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="h3">Current Status</h2>
            <p className="text-muted-foreground text-sm">Live at request time</p>
          </div>
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-success/20 text-success">
            {data?.status === 'ok' ? 'Healthy' : data?.status ?? 'Unknown'}
          </span>
        </div>

        {data ? (
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-lg border border-border p-3">
              <dt className="text-xs text-muted-foreground">Environment</dt>
              <dd className="mt-1 text-sm">{data.env}</dd>
            </div>
            <div className="rounded-lg border border-border p-3">
              <dt className="text-xs text-muted-foreground">Version</dt>
              <dd className="mt-1 text-sm font-mono">{data.version}</dd>
            </div>
            <div className="rounded-lg border border-border p-3 sm:col-span-2">
              <dt className="text-xs text-muted-foreground">Timestamp (UTC)</dt>
              <dd className="mt-1 text-sm font-mono">{data.timestamp}</dd>
            </div>
          </dl>
        ) : (
          <div
            role="status"
            className="rounded-lg border border-border p-4 bg-accent text-accent-foreground"
          >
            Unable to load health status. Try again later.
          </div>
        )}

        <p className="mt-4 text-xs text-muted-foreground">
          Timestamp reflects when this page fetched the status.
        </p>
      </section>
    </main>
  )
}

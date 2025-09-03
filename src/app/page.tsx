import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen bg-background p-8">
      <section className="mx-auto max-w-3xl space-y-6">
        <header className="space-y-2">
          <h1 className="h1 text-primary">Travel Tab</h1>
          <p className="text-muted-foreground">
            AI-Powered Travel Compliance Platform
          </p>
        </header>

        <div className="card shadow-card space-y-4">
          <p className="text-foreground">
            Welcome! This card uses the 8px grid, subtle shadows, and your color
            system.
          </p>
          <div className="flex gap-3">
            <Button variant="default">Primary</Button>
            <Button className="bg-secondary text-secondary-foreground">
              Secondary
            </Button>
            <Button className="bg-success text-success-foreground hover:opacity-90">
              Success
            </Button>
            <Button className="bg-warning text-warning-foreground hover:opacity-90">
              Warning
            </Button>
            <Button className="bg-error text-error-foreground hover:opacity-90">
              Error
            </Button>
          </div>
        </div>

        <footer className="text-xs text-muted-foreground">
          Set in <span className="font-mono">JetBrains Mono</span> for technical
          detail.
        </footer>
      </section>
    </main>
  );
}

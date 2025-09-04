import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import logo from "@/assets/travel-tab-logo.png";
import ThemeToggle from "@/components/theme-toggle";
import { getCurrentUser } from "@/lib/auth";
import LogoutButton from "@/components/logout-button";

function IconShield({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-5 text-primary", className)}
      aria-hidden
    >
      <path
        d="M12 3l7 3v5c0 4.418-3.582 8-8 8s-8-3.582-8-8V6l9-3z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        strokeLinejoin="round"
      />
      <path
        d="M9.5 12l1.75 1.75L15 10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconSpark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-5 text-warning", className)}
      aria-hidden
    >
      <path
        d="M12 2l2.5 5 5 2.5-5 2.5-2.5 5-2.5-5L4.5 9.5 9.5 7 12 2z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconGlobe({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-5 text-success", className)}
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M3 12h18M12 3c3 3.5 3 14.5 0 18-3-3.5-3-14.5 0-18z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconCheck({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("size-5 text-success", className)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M5 13l4 4L19 7"
        stroke="currentColor"
        strokeWidth="1.8"
        fill="none"
      />
    </svg>
  );
}

function IconDoc({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("size-5 text-primary", className)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path d="M7 3h6l5 5v13H7z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M13 3v6h6" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9 14h6M9 17h6" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function IconList({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("size-5 text-primary", className)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect x="4" y="5" width="3" height="3" rx="1" fill="currentColor" />
      <rect x="4" y="10.5" width="3" height="3" rx="1" fill="currentColor" />
      <rect x="4" y="16" width="3" height="3" rx="1" fill="currentColor" />
      <path
        d="M10 6.5h10M10 12h10M10 17.5h10"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function IconCalendar({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("size-5 text-primary", className)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect
        x="3"
        y="5"
        width="18"
        height="16"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M7 3v4M17 3v4M3 10h18" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export default async function Home() {
  const user = await getCurrentUser();
  return (
    <main className="min-h-screen bg-background">
      {/* Top Bar / Header */}
      <header className="sticky top-0 z-20 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src={logo}
              alt="Travel Tab logo"
              className="rounded-md"
              width={120}
              height={120}
              priority
            />
          </Link>
          <nav className="flex items-center gap-2">
            <ThemeToggle />
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">
                  Welcome, {user.fullName}
                </span>
                <LogoutButton />
              </div>
            ) : (
              <>
                <Button asChild variant="ghost" className="px-3">
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button
                  asChild
                  size="sm"
                  className="bg-primary text-primary-foreground"
                >
                  <Link href="/register">Get Started</Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative">
        <div
          className="absolute inset-0 bg-gradient-to-b from-slate-25 to-white dark:from-slate-900/50 dark:to-background"
          aria-hidden
        />
        <div className="relative mx-auto max-w-4xl px-6 pt-20 pb-16 text-center">
          <div className="mx-auto max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Travel <span className="text-primary">Smart</span>
              <br />
              Travel<span className="text-secondary">Stress-Free</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
              Navigate visa requirements, manage documents, and prepare for
              international travel with AI-powered guidance. Say goodbye to
              travel compliance confusion.
            </p>
            <div className="mt-8 flex flex-wrap gap-4 justify-center">
              <Button asChild size="lg" className="px-8">
                <Link href="/register">Start Planning Your Trip →</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="px-8">
                <Link href="/login">Sign In</Link>
              </Button>
            </div>

            <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-success/20 dark:bg-success/30 flex items-center justify-center">
                  <IconShield className="w-3 h-3 text-success" />
                </div>
                <span>Secure & Private</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-warning/20 dark:bg-warning/30 flex items-center justify-center">
                  <IconSpark className="w-3 h-3 text-warning" />
                </div>
                <span>AI-Powered</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-primary/20 dark:bg-primary/30 flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-primary"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <span>200+ Countries</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="h2 font-semibold">
            Everything You Need for
            <span className="mx-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Worry‑Free
            </span>
            Travel
          </h2>
          <p className="mt-3 text-muted-foreground">
            Travel Tab combines AI intelligence with practical tools to handle
            every aspect of your international travel preparation.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: <IconShield className="text-primary" />,
              title: "Visa Compliance",
              body: "Get personalized visa requirements and entry guidelines based on your nationality, destination, and travel purpose.",
            },
            {
              icon: <IconList className="text-primary" />,
              title: "Smart Checklists",
              body: "AI‑generated preparation checklists with time‑based deadlines to ensure you never miss important steps.",
            },
            {
              icon: <IconDoc className="text-primary" />,
              title: "Document Manager",
              body: "Securely store and organize all your travel documents in one place with easy access when you need them.",
            },
            {
              icon: <IconSpark className="text-warning" />,
              title: "Expert Q&A",
              body: "Ask specific questions about your travel requirements and get instant, personalized answers from our AI.",
            },
            {
              icon: <IconCalendar className="text-primary" />,
              title: "Trip Planning",
              body: "Organize multiple trips with comprehensive planning tools for each destination and travel module.",
            },
            {
              icon: <IconCheck className="text-success" />,
              title: "Timeline Management",
              body: "Never miss a deadline with intelligent scheduling that accounts for processing times and requirements.",
            },
          ].map((f) => (
            <div key={f.title} className="card shadow-card">
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
                  {f.icon}
                </div>
                <div>
                  <h3 className="font-semibold">{f.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{f.body}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Steps */}
      <section className="bg-accent">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="h2 font-semibold">Simple. Smart. Reliable.</h2>
            <p className="mt-3 text-muted-foreground">
              Get from travel planning to travel ready in just a few steps.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                num: 1,
                title: "Create Your Trip",
                desc: "Tell us about your destination, travel dates, and purpose. Our AI will understand your unique situation.",
              },
              {
                num: 2,
                title: "Get Your Brief",
                desc: "Receive a personalized compliance report with visa requirements, document needs, and important notices.",
              },
              {
                num: 3,
                title: "Travel Ready",
                desc: "Follow your personalized checklist, upload documents, and get ready for stress‑free travel.",
              },
            ].map((s) => (
              <div key={s.title} className="card shadow-card">
                <div className="mb-2 inline-flex size-8 items-center justify-center rounded-lg bg-primary/10 font-semibold text-primary">
                  {s.num}
                </div>
                <h3 className="font-semibold">{s.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="card shadow-card mx-auto max-w-3xl text-center">
          <h2 className="h2 font-semibold">Ready to Travel Smarter?</h2>
          <p className="mt-3 text-muted-foreground">
            Join thousands of travelers who have simplified their international
            travel preparation with Travel Tab.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Button asChild>
              <Link href="/register">Get Started Free →</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="#">Watch Demo</Link>
            </Button>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            No credit card required · Free tier available
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/60">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-8 sm:flex-row sm:items-center sm:justify-between ">
          <div className="flex items-center gap-3">
            <Image
              src={logo}
              alt="Travel Tab"
              width={120}
              height={120}
              className="rounded-md"
            />
            <div className="leading-tight mt-2">
              <div className="text-xs text-muted-foreground">
                AI‑powered travel compliance platform
              </div>
            </div>
          </div>
          <nav className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-foreground">
              Privacy
            </Link>
            <Link href="#" className="hover:text-foreground">
              Terms
            </Link>
            <Link href="#" className="hover:text-foreground">
              Support
            </Link>
          </nav>
        </div>
        <div className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Travel Tab. All rights reserved.
        </div>
      </footer>
    </main>
  );
}

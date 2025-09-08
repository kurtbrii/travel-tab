import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth";
import { IconShield, IconSpark, IconGlobe } from "@/components/icons";
import { IconMapper } from "@/components/icons/icon-mapper";
import { featuresData, stepsData } from "@/constants/data";
import Navbar from "@/components/navbar";
import Image from "next/image";
import logo from "@/assets/travel-tab-logo.png";

export default async function Home() {
  const user = await getCurrentUser();
  return (
    <main className="min-h-screen bg-background">
      <Navbar context="home" />

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
              {user ? (
                <Button asChild size="lg" className="px-8">
                  <Link href="/dashboard">Go to Dashboard →</Link>
                </Button>
              ) : (
                <>
                  <Button asChild size="lg" className="px-8">
                    <Link href="/register">Start Planning Your Trip →</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="px-8">
                    <Link href="/login">Sign In</Link>
                  </Button>
                </>
              )}
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
                  <IconGlobe className="w-3 h-3 text-primary" />
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
          {featuresData.map((feature) => (
            <div key={feature.title} className="card shadow-card">
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
                  <IconMapper
                    iconName={feature.iconName}
                    className={
                      feature.iconName === "spark"
                        ? "text-warning"
                        : "text-primary"
                    }
                  />
                </div>
                <div>
                  <h3 className="font-semibold">{feature.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {feature.body}
                  </p>
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
            {stepsData.map((step) => (
              <div key={step.title} className="card shadow-card">
                <div className="mb-2 inline-flex size-8 items-center justify-center rounded-lg bg-primary/10 font-semibold text-primary">
                  {step.num}
                </div>
                <h3 className="font-semibold">{step.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {step.desc}
                </p>
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
          &copy; {String(new Date().getUTCFullYear())} Travel Tab. All rights reserved.
        </div>
      </footer>
    </main>
  );
}

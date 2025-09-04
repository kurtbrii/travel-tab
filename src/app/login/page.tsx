"use client";

import * as React from "react";
import { z } from "zod";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { loginSchema } from "@/lib/validation";
import logo from "@/assets/travel-tab-logo.png";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";

type FormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [values, setValues] = React.useState<FormValues>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = React.useState<
    Partial<Record<keyof FormValues, string>>
  >({});
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [remember, setRemember] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const canSubmit = React.useMemo(() => {
    const parsed = loginSchema.safeParse({
      email: values.email.trim(),
      password: values.password,
    });
    return parsed.success;
  }, [values.email, values.password]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setServerError(null);
    setSuccess(false);
    setErrors({});

    const normalized = {
      email: values.email.trim(),
      password: values.password,
    } as const;

    const parsed = loginSchema.safeParse(normalized);
    if (!parsed.success) {
      const fieldErrors: Partial<Record<keyof FormValues, string>> = {};
      for (const issue of parsed.error.issues) {
        const path = issue.path[0] as keyof FormValues | undefined;
        if (path) fieldErrors[path] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const data = await res.json();
      if (!res.ok) {
        setServerError(data?.error?.message ?? "Sign in failed");
      } else {
        setSuccess(true);
        // In a real app, you might redirect after a short delay
      }
    } catch {
      setServerError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center px-6 py-10">
        {/* Logo */}
        <Image
          src={logo}
          alt="TravelTab"
          width={200}
          height={200}
          priority
          className="mb-5"
        />

        {/* Heading */}
        <h1 className="h1 text-foreground text-center">Welcome Back</h1>
        <p className="mt-2 text-muted-foreground text-center">
          Sign in to your Travel Tab account
        </p>

        {/* Card */}
        <div className="card mt-8 w-full max-w-xl border border-border shadow-card">
          <div className="mb-4 text-center">
            <h2 className="h2 text-primary font-bold">Sign In</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Enter your credentials to access your travel plans
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="mb-1 flex items-center gap-2 text-sm font-medium text-foreground">
                <Mail className="size-4 text-muted-foreground" /> Email Address
              </label>
              <input
                type="email"
                className={cn(
                  "mt-1 w-full rounded-lg border bg-card px-3 py-2 text-foreground shadow-xs outline-none placeholder:text-muted-foreground focus-visible:ring-[3px]",
                  errors.email
                    ? "border-error focus-visible:ring-error/20"
                    : "border-input focus-visible:border-primary focus-visible:ring-primary/20"
                )}
                placeholder="you@example.com"
                value={values.email}
                aria-invalid={!!errors.email}
                onChange={(e) =>
                  setValues((v) => ({ ...v, email: e.target.value }))
                }
              />
              {errors.email && (
                <p className="mt-1 text-sm text-error">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="mb-1 flex items-center gap-2 text-sm font-medium text-foreground">
                <Lock className="size-4 text-muted-foreground" /> Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className={cn(
                    "mt-1 w-full rounded-lg border bg-card px-3 py-2 pr-10 text-foreground shadow-xs outline-none placeholder:text-muted-foreground focus-visible:ring-[3px]",
                    errors.password
                      ? "border-error focus-visible:ring-error/20"
                      : "border-input focus-visible:border-primary focus-visible:ring-primary/20"
                  )}
                  placeholder="Enter your password"
                  value={values.password}
                  aria-invalid={!!errors.password}
                  onChange={(e) =>
                    setValues((v) => ({ ...v, password: e.target.value }))
                  }
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute inset-y-0 right-2 grid place-items-center text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-foreground">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="size-4 rounded border-input text-primary focus-visible:ring-primary/20"
                  />
                  Remember me
                </label>
                <Link href="#" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
            </div>

            {serverError && <p className="text-error text-sm">{serverError}</p>}
            {success && (
              <p className="text-success text-sm">You are signed in!</p>
            )}

            {/* Submit */}
            <Button
              type="submit"
              disabled={isSubmitting || !canSubmit}
              className={cn(
                "w-full h-12 text-base rounded-xl disabled:opacity-60 disabled:cursor-not-allowed",
                "bg-primary text-primary-foreground hover:opacity-95"
              )}
            >
              {isSubmitting ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="size-4 animate-spin" /> Signing In
                </span>
              ) : (
                <span className="inline-flex items-center gap-2">
                  Sign In <ArrowRight className="size-4" />
                </span>
              )}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-primary hover:underline">
                Create one now
              </Link>
            </p>
          </form>
        </div>

        {/* Disclaimer */}
        <p className="mt-6 text-center text-xs text-muted-foreground">
          By signing in, you agree to our{" "}
          <Link href="#" className="underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="#" className="underline">
            Privacy Policy
          </Link>
        </p>
      </section>
    </main>
  );
}

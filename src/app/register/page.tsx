"use client";

import * as React from "react";
import { z } from "zod";
import { registerSchema } from "@/lib/validation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import logo from "@/assets/travel-tab-logo.png";
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Circle,
} from "lucide-react";

type FormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  const [values, setValues] = React.useState<FormValues>({
    fullName: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = React.useState<
    Partial<Record<keyof FormValues, string>>
  >({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [fullName, setFullName] = React.useState("");
  const [confirm, setConfirm] = React.useState("");

  const canSubmit = React.useMemo(() => {
    const email = values.email.trim();
    const name = fullName.trim();
    const pass = values.password;
    const baseValid = registerSchema.safeParse({
      email,
      fullName: name,
      password: pass,
    }).success;
    const nameValid = name.length > 0;
    const confirmValid = pass == confirm;
    // const confirmValid = confirm.trim().length > 0 && confirm === pass;
    return baseValid && nameValid && confirmValid;
  }, [values.email, values.password, fullName, confirm]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerError(null);
    setSuccess(false);
    setErrors({});

    const normalized = {
      email: values.email.trim(),
      fullName: fullName.trim(),
      password: values.password,
    } as const;
    const parsed = registerSchema.safeParse(normalized);
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
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        setServerError(data?.error?.message ?? "Registration failed");
      } else {
        setSuccess(true);
        // Redirect to dashboard after successful registration
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 1000);
      }
    } catch {
      setServerError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <p className="mt-2 text-muted-foreground text-center">
          Create your account and start planning worry-free trips
        </p>

        {/* Card */}
        <div className="card mt-8 w-full max-w-xl border border-border shadow-card">
          <div className="mb-4 text-center">
            <h2 className="h2 text-primary font-bold">Create Account</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Enter your details to get started with Travel Tab
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="mb-1 flex items-center gap-2 text-sm font-medium text-foreground">
                <User className="size-4 text-muted-foreground" /> Full Name
              </label>
              <input
                type="text"
                className="mt-1 w-full rounded-lg border border-input bg-card px-3 py-2 text-foreground shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-primary/20 focus-visible:ring-[3px]"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

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
                  placeholder="Create a strong password"
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
              <p className="mt-1 text-xs text-muted-foreground">
                Password must be at least 8 characters long
              </p>
              <ul className="mt-2 grid grid-cols-2 gap-1 text-xs">
                {[
                  {
                    id: "len",
                    label: "8–72 characters",
                    valid:
                      values.password.length >= 8 &&
                      values.password.length <= 72,
                  },
                  {
                    id: "lc",
                    label: "Lowercase letter",
                    valid: /[a-z]/.test(values.password),
                  },
                  {
                    id: "uc",
                    label: "Uppercase letter",
                    valid: /[A-Z]/.test(values.password),
                  },
                  {
                    id: "num",
                    label: "Number",
                    valid: /[0-9]/.test(values.password),
                  },
                  {
                    id: "sym",
                    label: "Symbol",
                    valid: /[^A-Za-z0-9]/.test(values.password),
                  },
                  {
                    id: "space",
                    label: "No spaces",
                    valid: !/\s/.test(values.password),
                  },
                ].map((r) => (
                  <li
                    key={r.id}
                    className={cn(
                      "flex items-center gap-1.5",
                      r.valid ? "text-success" : "text-error"
                    )}
                  >
                    {r.valid ? (
                      <CheckCircle2 className="size-3" />
                    ) : (
                      <Circle className="size-3" />
                    )}
                    <span>{r.label}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="mb-1 flex items-center gap-2 text-sm font-medium text-foreground">
                <Lock className="size-4 text-muted-foreground" /> Confirm
                Password
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  className={cn(
                    "mt-1 w-full rounded-lg border bg-card px-3 py-2 pr-10 text-foreground shadow-xs outline-none placeholder:text-muted-foreground focus-visible:ring-[3px]",
                    confirm && confirm !== values.password
                      ? "border-error focus-visible:ring-error/20"
                      : "border-input focus-visible:border-primary focus-visible:ring-primary/20"
                  )}
                  placeholder="Confirm your password"
                  value={confirm}
                  aria-invalid={!!confirm && confirm !== values.password}
                  onChange={(e) => setConfirm(e.target.value)}
                  autoCorrect="off"
                  autoCapitalize="none"
                  spellCheck={false}
                />
                <button
                  type="button"
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                  onClick={() => setShowConfirm((s) => !s)}
                  className="absolute inset-y-0 right-2 grid place-items-center text-muted-foreground hover:text-foreground"
                >
                  {showConfirm ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
              {confirm && confirm !== values.password && (
                <p className="mt-1 text-sm text-error">
                  Passwords do not match
                </p>
              )}
            </div>

            {serverError && <p className="text-error text-sm">{serverError}</p>}
            {success && (
              <p className="text-success text-sm">Registration successful!</p>
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
                  <Loader2 className="size-4 animate-spin" /> Creating Account
                </span>
              ) : (
                <span className="inline-flex items-center gap-2">
                  Create Account <ArrowRight className="size-4" />
                </span>
              )}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Sign in instead
              </Link>
            </p>
          </form>
        </div>

        {/* Disclaimer */}
        <p className="mt-6 text-center text-xs text-muted-foreground">
          By creating an account, you agree to our{" "}
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

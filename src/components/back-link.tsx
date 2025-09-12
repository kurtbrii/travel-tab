"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { cn } from "@/lib/utils";

interface BackLinkProps extends React.ComponentProps<typeof Link> {}

export default function BackLink({ className, href, onClick, ...rest }: BackLinkProps) {
  const router = useRouter();

  const handleClick = useCallback<NonNullable<BackLinkProps["onClick"]>>(
    (e) => {
      onClick?.(e);
      // Prefer client history back to preserve full prior state
      try {
        e.preventDefault();
        // Attempt to go back; provide a safe fallback to href if history is empty
        router.back();
        // Fallback in case back() does nothing
        const to = typeof href === "string" ? href : (href as any)?.href ?? "/trips";
        setTimeout(() => router.push(to), 50);
      } catch {
        // If anything goes wrong, let the default link behavior proceed
      }
    },
    [href, onClick, router]
  );

  return (
    <Link {...rest} href={href} onClick={handleClick} className={cn(className)} />
  );
}


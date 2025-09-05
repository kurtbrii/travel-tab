import { cn } from "@/lib/utils";
import { IconProps } from "@/types";

export function IconShield({ className, size = 20 }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-primary", className)}
      width={size}
      height={size}
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

export function IconSpark({ className, size = 20 }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-warning", className)}
      width={size}
      height={size}
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

export function IconGlobe({ className, size = 20 }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-success", className)}
      width={size}
      height={size}
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

export function IconCheck({ className, size = 20 }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("text-success", className)}
      width={size}
      height={size}
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

export function IconDoc({ className, size = 20 }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("text-primary", className)}
      width={size}
      height={size}
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

export function IconList({ className, size = 20 }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("text-primary", className)}
      width={size}
      height={size}
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

export function IconCalendar({ className, size = 20 }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("text-primary", className)}
      width={size}
      height={size}
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

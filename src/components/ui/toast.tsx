"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

type ToastVariant = "success" | "error" | "warning" | "info";

export function Toast({
  open,
  message,
  onClose,
  variant = "info",
  duration = 2500,
}: {
  open: boolean;
  message: string | null;
  onClose: () => void;
  variant?: ToastVariant;
  duration?: number;
}) {
  useEffect(() => {
    if (!open) return;
    const id = setTimeout(onClose, duration);
    return () => clearTimeout(id);
  }, [open, duration, onClose]);

  if (!open || !message) return null;

  // Responsive placement:
  // - Mobile (default): bottom-center above safe-area, avoids URL bar/headers
  // - sm+ screens: top-right below navbar area
  const container = cn(
    "fixed z-50 pointer-events-none",
    // mobile bottom-center
    "left-1/2 -translate-x-1/2 bottom-[max(env(safe-area-inset-bottom),1rem)]",
    // desktop/tablet top-right
    "sm:left-auto sm:translate-x-0 sm:right-4 sm:top-16 sm:bottom-auto"
  );

  const toast = cn(
    "px-4 py-2 rounded-md shadow-lg text-sm border pointer-events-auto",
    "bg-card/95 backdrop-blur",
    {
      success: "bg-success/15 text-success border-success/30",
      error: "bg-error/15 text-error border-error/30",
      warning: "bg-warning/15 text-warning border-warning/30",
      info: "bg-accent text-foreground border-border",
    }[variant]
  );

  return createPortal(
    <div className={container} aria-live="polite">
      <div role="status" className={toast}>
        {message}
      </div>
    </div>,
    document.body
  );
}

export default Toast;

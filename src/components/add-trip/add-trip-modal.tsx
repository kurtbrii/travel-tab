"use client";

import { ReactNode, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AddTripModalProps {
  open: boolean;
  onClose: () => void;
  header?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  ariaLabelledBy?: string;
}

export default function AddTripModal({
  open,
  onClose,
  header,
  children,
  footer,
  ariaLabelledBy,
}: AddTripModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  // Handle escape + focus trap
  const handleKeyDown = useCallback((event: { key: string; shiftKey: boolean; preventDefault: () => void }) => {
    if (event.key === 'Escape') {
      onClose();
      return;
    }

    if (event.key === 'Tab' && modalRef.current) {
      const focusable = modalRef.current.querySelectorAll<HTMLElement>(
        'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );

      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement | null;
      const isShift = event.shiftKey;

      if (!isShift && active === last) {
        event.preventDefault();
        first.focus();
      } else if (isShift && active === first) {
        event.preventDefault();
        last.focus();
      }
    }
  }, [onClose]);

  // Add event listeners when modal is open
  useEffect(() => {
    if (open) {
      // Save previously focused element to restore later
      previouslyFocusedRef.current = document.activeElement as HTMLElement | null;

      // Key handling is attached to the dialog element via onKeyDown
      document.body.style.overflow = 'hidden';

      // Move initial focus inside the dialog
      // Try first focusable; fallback to the dialog container
      setTimeout(() => {
        if (!modalRef.current) return;
        const focusable = modalRef.current.querySelector<HTMLElement>(
          'input, select, textarea, button, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable) {
          focusable.focus();
        } else {
          modalRef.current.setAttribute('tabindex', '-1');
          modalRef.current.focus();
        }
      }, 0);
    }

    return () => {
      // No document-level key listeners to avoid interfering with inputs
      document.body.style.overflow = 'unset';

      // Restore focus to the previously focused trigger, if any
      if (previouslyFocusedRef.current && typeof previouslyFocusedRef.current.focus === 'function') {
        previouslyFocusedRef.current.focus();
      }
    };
  }, [open]);

  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50">
          <motion.div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity duration-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            role="presentation"
            onMouseDown={onClose}
          />

          <div className="absolute inset-0 grid place-items-center p-4 overflow-y-auto">
            <motion.div
              ref={modalRef}
              className="w-full max-w-lg rounded-xl border border-border bg-card shadow-2xl my-8"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ 
                type: "spring",
                damping: 20,
                stiffness: 200,
                duration: 0.5
              }}
              role="dialog"
              aria-modal="true"
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              onKeyDown={(e) => handleKeyDown(e)}
              aria-labelledby={ariaLabelledBy}
              >
              {header}
              {children}
              {footer}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}

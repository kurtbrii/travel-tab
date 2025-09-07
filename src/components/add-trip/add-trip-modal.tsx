"use client";

import { ReactNode, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AddTripModalProps {
  open: boolean;
  onClose: () => void;
  header?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}

export default function AddTripModal({
  open,
  onClose,
  header,
  children,
  footer,
}: AddTripModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle click outside
  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      onClose();
    }
  }, [onClose]);

  // Handle escape key
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  // Add event listeners when modal is open
  useEffect(() => {
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [open, handleClickOutside, handleKeyDown]);

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

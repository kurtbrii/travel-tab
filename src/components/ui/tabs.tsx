"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
  initialTabId?: string;
  className?: string;
}

export default function Tabs({ tabs, initialTabId, className }: TabsProps) {
  const [activeId, setActiveId] = useState<string>(
    initialTabId && tabs.some(t => t.id === initialTabId) ? initialTabId : tabs[0]?.id
  );
  const listRef = useRef<HTMLDivElement>(null);
  const labelId = useId();

  const activeIndex = useMemo(() => tabs.findIndex(t => t.id === activeId), [tabs, activeId]);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!listRef.current) return;
      const buttons = listRef.current.querySelectorAll<HTMLButtonElement>("[role='tab']");
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        e.preventDefault();
        const dir = e.key === "ArrowRight" ? 1 : -1;
        const next = (activeIndex + dir + tabs.length) % tabs.length;
        const nextId = tabs[next]?.id;
        if (nextId) setActiveId(nextId);
        buttons[next]?.focus();
      } else if (e.key === "Home") {
        e.preventDefault();
        setActiveId(tabs[0]?.id);
        buttons[0]?.focus();
      } else if (e.key === "End") {
        e.preventDefault();
        const last = tabs.length - 1;
        setActiveId(tabs[last]?.id);
        buttons[last]?.focus();
      }
    },
    [activeIndex, tabs]
  );

  useEffect(() => {
    // Ensure activeId is valid even if tabs prop changes
    if (!tabs.some(t => t.id === activeId) && tabs[0]) {
      setActiveId(tabs[0].id);
    }
  }, [tabs, activeId]);

  return (
    <div className={cn("w-full", className)}>
      <div
        ref={listRef}
        role="tablist"
        aria-label="Sections"
        aria-orientation="horizontal"
        onKeyDown={onKeyDown}
        className="flex gap-2 border-b border-border/60"
      >
        {tabs.map((t, i) => (
          <button
            key={t.id}
            role="tab"
            id={`${labelId}-tab-${t.id}`}
            aria-selected={activeId === t.id}
            aria-controls={`${labelId}-panel-${t.id}`}
            tabIndex={activeId === t.id ? 0 : -1}
            className={cn(
              "px-3 py-2 text-sm font-medium border-b-2 -mb-[1px] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
              activeId === t.id ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
            )}
            onClick={() => setActiveId(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tabs.map((t) => (
        <div
          key={t.id}
          role="tabpanel"
          id={`${labelId}-panel-${t.id}`}
          aria-labelledby={`${labelId}-tab-${t.id}`}
          hidden={activeId !== t.id}
          className="pt-4"
        >
          {activeId === t.id ? t.content : null}
        </div>
      ))}
    </div>
  );
}

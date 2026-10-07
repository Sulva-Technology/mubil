"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { EASE } from "@/lib/motion";

type ToastTone = "success" | "error" | "info";
type ToastItem = { id: number; message: string; tone: ToastTone };
type ToastApi = { toast: (message: string, tone?: ToastTone) => void };

const ToastContext = createContext<ToastApi | null>(null);

const icons = { success: CheckCircle2, error: AlertCircle, info: Info } as const;
const iconColor = { success: "text-success", error: "text-error", info: "text-brand" } as const;

/** Wrap the app once. Use `useToast()` anywhere below it. */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const nextId = useRef(0);
  const reduce = useReducedMotion();

  const dismiss = useCallback((id: number) => {
    setItems((current) => current.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (message: string, tone: ToastTone = "success") => {
      const id = ++nextId.current;
      setItems((current) => [...current.slice(-2), { id, message, tone }]);
      window.setTimeout(() => dismiss(id), 4000);
    },
    [dismiss],
  );

  const api = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-6 z-[100] flex flex-col items-center gap-3 px-4"
      >
        <AnimatePresence initial={false}>
          {items.map((item) => {
            const Icon = icons[item.tone];
            return (
              <motion.div
                key={item.id}
                layout={!reduce}
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.96, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.98 }}
                transition={{ duration: 0.45, ease: EASE }}
                role={item.tone === "error" ? "alert" : "status"}
                className="glass glass-strong pointer-events-auto flex max-w-md items-center gap-3 rounded-full py-2 pl-4 pr-2 text-small font-medium text-ink"
              >
                <Icon aria-hidden className={cn("size-5 shrink-0", iconColor[item.tone])} strokeWidth={2} />
                <span>{item.message}</span>
                <button
                  type="button"
                  onClick={() => dismiss(item.id)}
                  aria-label="Dismiss notification"
                  className="grid size-8 place-items-center rounded-full text-ink-2 transition-colors hover:bg-ice hover:text-ink"
                >
                  <X aria-hidden className="size-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}

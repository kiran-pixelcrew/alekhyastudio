"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AdminButton } from "@/components/admin/AdminButton";

type ConfirmOptions = {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "danger" | "default";
};

type ToastTone = "success" | "error" | "info";

type ToastItem = {
  id: number;
  message: string;
  tone: ToastTone;
};

type AdminUiContextValue = {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
  toast: (message: string, tone?: ToastTone) => void;
};

const AdminUiContext = createContext<AdminUiContextValue | null>(null);

export function useAdminUi() {
  const ctx = useContext(AdminUiContext);
  if (!ctx) {
    throw new Error("useAdminUi must be used within AdminUiProvider");
  }
  return ctx;
}

export function AdminUiProvider({ children }: { children: ReactNode }) {
  const [confirmState, setConfirmState] = useState<
    (ConfirmOptions & { open: boolean }) | null
  >(null);
  const resolverRef = useRef<((value: boolean) => void) | null>(null);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const toastId = useRef(0);

  const closeConfirm = useCallback((value: boolean) => {
    resolverRef.current?.(value);
    resolverRef.current = null;
    setConfirmState(null);
  }, []);

  const confirm = useCallback((options: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      resolverRef.current?.(false);
      resolverRef.current = resolve;
      setConfirmState({ ...options, open: true });
    });
  }, []);

  const toast = useCallback((message: string, tone: ToastTone = "info") => {
    const id = ++toastId.current;
    setToasts((current) => [...current, { id, message, tone }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((item) => item.id !== id));
    }, 4200);
  }, []);

  useEffect(() => {
    if (!confirmState?.open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") closeConfirm(false);
    }

    document.addEventListener("keydown", onKeyDown);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previous;
    };
  }, [closeConfirm, confirmState?.open]);

  const value = useMemo(() => ({ confirm, toast }), [confirm, toast]);

  const tone = confirmState?.tone ?? "danger";

  return (
    <AdminUiContext.Provider value={value}>
      {children}

      {confirmState?.open ? (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-charcoal/45 p-4 backdrop-blur-[2px]"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeConfirm(false);
          }}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="admin-confirm-title"
            aria-describedby={
              confirmState.description ? "admin-confirm-desc" : undefined
            }
            className="w-full max-w-md animate-[admin-dialog-in_180ms_ease-out] rounded-2xl border border-charcoal/10 bg-cream-soft p-6 shadow-2xl shadow-charcoal/20"
          >
            <div
              className={`mb-4 inline-flex size-10 items-center justify-center rounded-full ${
                tone === "danger"
                  ? "bg-terracotta/15 text-terracotta-deep"
                  : "bg-button/15 text-button-deep"
              }`}
              aria-hidden
            >
              {tone === "danger" ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle
                    cx="12"
                    cy="12"
                    r="9"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                  <path
                    d="M12 8v5m0 3h.01"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </div>

            <h2
              id="admin-confirm-title"
              className="font-display text-2xl text-charcoal"
            >
              {confirmState.title}
            </h2>
            {confirmState.description ? (
              <p
                id="admin-confirm-desc"
                className="mt-2 text-sm leading-relaxed text-charcoal-muted"
              >
                {confirmState.description}
              </p>
            ) : null}

            <div className="mt-6 flex flex-wrap justify-end gap-2">
              <AdminButton
                variant="secondary"
                size="md"
                onClick={() => closeConfirm(false)}
              >
                {confirmState.cancelLabel ?? "Cancel"}
              </AdminButton>
              <AdminButton
                variant={tone === "danger" ? "danger" : "primary"}
                size="md"
                onClick={() => closeConfirm(true)}
                autoFocus
              >
                {confirmState.confirmLabel ?? "Confirm"}
              </AdminButton>
            </div>
          </div>
        </div>
      ) : null}

      <div className="pointer-events-none fixed bottom-5 right-5 z-[90] flex w-[min(22rem,calc(100vw-2rem))] flex-col gap-2">
        {toasts.map((item) => (
          <div
            key={item.id}
            className={[
              "pointer-events-auto animate-[admin-toast-in_220ms_ease-out] rounded-xl border px-4 py-3 text-sm shadow-lg",
              item.tone === "success"
                ? "border-teal/20 bg-teal text-cream"
                : item.tone === "error"
                  ? "border-terracotta/30 bg-terracotta-deep text-cream"
                  : "border-charcoal/10 bg-charcoal text-cream",
            ].join(" ")}
            role="status"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="leading-relaxed">{item.message}</p>
              <button
                type="button"
                onClick={() =>
                  setToasts((current) =>
                    current.filter((toastItem) => toastItem.id !== item.id),
                  )
                }
                className="shrink-0 rounded-md px-1.5 py-0.5 text-xs uppercase tracking-[0.14em] opacity-70 hover:opacity-100"
                aria-label="Dismiss"
              >
                Close
              </button>
            </div>
          </div>
        ))}
      </div>
    </AdminUiContext.Provider>
  );
}

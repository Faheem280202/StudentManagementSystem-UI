import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

// ─── Context ──────────────────────────────────────────────────────────────────

const ToastContext = createContext(null);

// ─── Icons ───────────────────────────────────────────────────────────────────

const ICONS = {
  success: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="9" r="9" fill="rgba(255,255,255,0.25)" />
      <path d="M5 9l3 3 5-5" stroke="#fff" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  error: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="9" r="9" fill="rgba(255,255,255,0.25)" />
      <path d="M6 6l6 6M12 6l-6 6" stroke="#fff" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  ),
  warning: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="9" r="9" fill="rgba(255,255,255,0.25)" />
      <path d="M9 5v5M9 12.5v.5" stroke="#fff" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  ),
  info: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="9" r="9" fill="rgba(255,255,255,0.25)" />
      <path d="M9 8v5M9 5.5v.5" stroke="#fff" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  ),
};

const COLORS = {
  success: "#22c55e",
  error:   "#ef4444",
  warning: "#f59e0b",
  info:    "#3b82f6",
};

const DURATION = 3500; // ms before auto-dismiss

// ─── Single Toast item ────────────────────────────────────────────────────────

function ToastItem({ id, message, type, onRemove }) {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef(null);

  // Slide in on mount
  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  // Auto-dismiss
  useEffect(() => {
    timerRef.current = setTimeout(() => dismiss(), DURATION);
    return () => clearTimeout(timerRef.current);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function dismiss() {
    setVisible(false);
    // Wait for slide-out animation before removing from DOM
    setTimeout(() => onRemove(id), 300);
  }

  return (
    <div
      onClick={dismiss}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.625rem",
        padding: "0.75rem 1rem",
        borderRadius: "0.5rem",
        background: COLORS[type] ?? COLORS.info,
        color: "#fff",
        fontWeight: 500,
        fontSize: "0.875rem",
        lineHeight: 1.4,
        boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
        cursor: "pointer",
        userSelect: "none",
        minWidth: "220px",
        maxWidth: "360px",
        // Slide-in / slide-out
        transform: visible ? "translateX(0)" : "translateX(calc(100% + 1.5rem))",
        opacity: visible ? 1 : 0,
        transition: "transform 0.3s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s ease",
      }}
    >
      {ICONS[type] ?? ICONS.info}
      <span style={{ flex: 1 }}>{message}</span>
      {/* Close × */}
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ opacity: 0.7, flexShrink: 0 }}>
        <path d="M2 2l10 10M12 2L2 12" stroke="#fff" strokeWidth="1.75" strokeLinecap="round" />
      </svg>
    </div>
  );
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const counterRef = useRef(0);

  const showToast = useCallback((message, type = "info") => {
    const id = ++counterRef.current;
    setToasts(prev => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={showToast}>
      {children}

      {/* Toast stack — fixed bottom-right */}
      <div
        aria-live="polite"
        style={{
          position: "fixed",
          bottom: "1.5rem",
          right: "1.5rem",
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          pointerEvents: "none",
        }}
      >
        {toasts.map(t => (
          <div key={t.id} style={{ pointerEvents: "auto" }}>
            <ToastItem
              id={t.id}
              message={t.message}
              type={t.type}
              onRemove={removeToast}
            />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Returns a showToast(message, type) function.
 * type: "success" | "error" | "warning" | "info"
 *
 * Usage:
 *   const showToast = useToast();
 *   showToast("Saved!", "success");
 */
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}

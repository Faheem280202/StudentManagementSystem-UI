import { useState, useEffect, useCallback } from "react";

// ─── useAsync ────────────────────────────────────────────────
// Generic hook for async operations with loading/error state
export function useAsync(asyncFn, deps = [], immediate = true) {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error,   setError]   = useState(null);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await asyncFn(...args);
      setData(result);
      return result;
    } catch (err) {
      setError(err.message ?? "Something went wrong");
      throw err;
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    if (immediate) execute();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [immediate]);

  return { data, loading, error, execute, setData };
}

// ─── useDisclosure ───────────────────────────────────────────
// Toggle open/close state for modals/drawers
export function useDisclosure(initialState = false) {
  const [isOpen, setIsOpen] = useState(initialState);
  const open    = useCallback(() => setIsOpen(true),  []);
  const close   = useCallback(() => setIsOpen(false), []);
  const toggle  = useCallback(() => setIsOpen(v => !v), []);
  return { isOpen, open, close, toggle };
}

// ─── useToast ────────────────────────────────────────────────
export function useToast() {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "info", duration = 4000) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  }, []);

  const toast = {
    success: (msg) => addToast(msg, "success"),
    error:   (msg) => addToast(msg, "error"),
    info:    (msg) => addToast(msg, "info"),
    warning: (msg) => addToast(msg, "warning"),
  };

  return { toasts, toast };
}

// ─── useLocalStorage ─────────────────────────────────────────
export function useLocalStorage(key, defaultValue) {
  const [value, setValue] = useState(() => {
    try { return JSON.parse(localStorage.getItem(key)) ?? defaultValue; }
    catch { return defaultValue; }
  });

  const set = useCallback((newVal) => {
    setValue(newVal);
    localStorage.setItem(key, JSON.stringify(newVal));
  }, [key]);

  return [value, set];
}

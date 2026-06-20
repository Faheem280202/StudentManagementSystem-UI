// ============================================================
// Common Components — building blocks used throughout the app
// ============================================================

import { useState, forwardRef } from "react";

// ─── Button ──────────────────────────────────────────────────
export function Button({
  children,
  variant = "primary",   // primary | secondary | ghost | danger | success
  size = "md",           // sm | md | lg
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = "",
  ...props
}) {
  const base = "btn";
  const cls = [base, `btn-${variant}`, `btn-${size}`, fullWidth ? "btn-full" : "", className]
    .filter(Boolean).join(" ");

  return (
    <button className={cls} disabled={disabled || loading} {...props}>
      {loading ? <Spinner size="sm" color="current" /> : leftIcon}
      {children && <span>{children}</span>}
      {!loading && rightIcon}
    </button>
  );
}

// ─── Input ───────────────────────────────────────────────────
export const Input = forwardRef(function Input({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  className = "",
  required,
  ...props
}, ref) {
  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label className="form-label">
          {label}
          {required && <span className="form-required">*</span>}
        </label>
      )}
      <div className="input-wrapper">
        {leftIcon && <span className="input-icon input-icon-left">{leftIcon}</span>}
        <input
          ref={ref}
          className={`form-input ${leftIcon ? "has-left-icon" : ""} ${rightIcon ? "has-right-icon" : ""} ${error ? "input-error" : ""}`}
          {...props}
        />
        {rightIcon && <span className="input-icon input-icon-right">{rightIcon}</span>}
      </div>
      {error && <span className="form-error">{error}</span>}
      {hint && !error && <span className="form-hint">{hint}</span>}
    </div>
  );
});

// ─── Select ──────────────────────────────────────────────────
export const Select = forwardRef(function Select({
  label,
  error,
  hint,
  options = [],
  placeholder = "Select an option",
  className = "",
  required,
  ...props
}, ref) {
  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label className="form-label">
          {label}
          {required && <span className="form-required">*</span>}
        </label>
      )}
      <div className="input-wrapper">
        <select
          ref={ref}
          className={`form-input form-select ${error ? "input-error" : ""}`}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <span className="select-arrow">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </div>
      {error && <span className="form-error">{error}</span>}
      {hint && !error && <span className="form-hint">{hint}</span>}
    </div>
  );
});

// ─── Badge ───────────────────────────────────────────────────
export function Badge({ children, variant = "default", size = "sm" }) {
  return (
    <span className={`badge badge-${variant} badge-${size}`}>{children}</span>
  );
}

// ─── Spinner ─────────────────────────────────────────────────
export function Spinner({ size = "md", color = "primary" }) {
  return (
    <svg
      className={`spinner spinner-${size} spinner-${color}`}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"
        strokeDasharray="31.416" strokeDashoffset="10" />
    </svg>
  );
}

// ─── Avatar ──────────────────────────────────────────────────
export function Avatar({ name = "", src, size = "md", role }) {
  const initials = name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  const roleColors = {
    Admin:   "#1E3A5F",
    Teacher: "#2D9B6F",
    Student: "#3A7EC8",
    Parent:  "#D4874A",
  };
  const bg = roleColors[role] ?? "#64748B";

  if (src) {
    return (
      <img src={src} alt={name} className={`avatar avatar-${size}`} style={{ objectFit: "cover", borderRadius: "50%" }} />
    );
  }

  return (
    <div className={`avatar avatar-${size}`} style={{ background: bg }}>
      {initials || "?"}
    </div>
  );
}

// ─── Card ────────────────────────────────────────────────────
export function Card({ children, className = "", padding = "md", shadow = "md", ...props }) {
  return (
    <div className={`card card-pad-${padding} card-shadow-${shadow} ${className}`} {...props}>
      {children}
    </div>
  );
}

// ─── Modal ───────────────────────────────────────────────────
export function Modal({ isOpen, onClose, title, children, size = "md", footer }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal modal-${size}`} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button className="modal-close" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
}

// ─── Table ───────────────────────────────────────────────────
export function Table({ columns, data, loading, emptyText = "No data found", onRowClick }) {
  return (
    <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col.key} style={{ width: col.width }}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="table-loading">
                <Spinner size="lg" />
                <span>Loading...</span>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="table-empty">
                <div className="empty-state">
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <rect x="8" y="8" width="32" height="32" rx="4" stroke="currentColor" strokeWidth="2" strokeDasharray="4 2"/>
                    <path d="M18 24h12M24 18v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <p>{emptyText}</p>
                </div>
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr
                key={row.id ?? i}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={onRowClick ? "row-clickable" : ""}
              >
                {columns.map(col => (
                  <td key={col.key}>
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

// ─── Toast ───────────────────────────────────────────────────
export function ToastContainer({ toasts }) {
  const icons = {
    success: "✓",
    error:   "✕",
    warning: "⚠",
    info:    "ℹ",
  };

  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          <span className="toast-icon">{icons[t.type]}</span>
          <span className="toast-message">{t.message}</span>
        </div>
      ))}
    </div>
  );
}

// ─── PageHeader ──────────────────────────────────────────────
export function PageHeader({ title, subtitle, actions, breadcrumb }) {
  return (
    <div className="page-header">
      {breadcrumb && (
        <nav className="breadcrumb">
          {breadcrumb.map((b, i) => (
            <span key={i} className="breadcrumb-item">
              {i > 0 && <span className="breadcrumb-sep">/</span>}
              {b}
            </span>
          ))}
        </nav>
      )}
      <div className="page-header-row">
        <div>
          <h1 className="page-title">{title}</h1>
          {subtitle && <p className="page-subtitle">{subtitle}</p>}
        </div>
        {actions && <div className="page-actions">{actions}</div>}
      </div>
    </div>
  );
}

// ─── StatCard ────────────────────────────────────────────────
export function StatCard({ label, value, icon, color = "primary", trend, loading }) {
  return (
    <div className={`stat-card stat-card-${color}`}>
      <div className="stat-card-icon">{icon}</div>
      <div className="stat-card-body">
        <span className="stat-card-label">{label}</span>
        {loading
          ? <div className="stat-card-skeleton" />
          : <span className="stat-card-value">{value ?? "—"}</span>
        }
        {trend !== undefined && (
          <span className={`stat-card-trend ${trend >= 0 ? "trend-up" : "trend-down"}`}>
            {trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}%
          </span>
        )}
      </div>
    </div>
  );
}

// ─── EmptyState ──────────────────────────────────────────────
export function EmptyState({ icon, title, description, action }) {
  return (
    <div className="empty-state-page">
      {icon && <div className="empty-state-icon">{icon}</div>}
      <h3 className="empty-state-title">{title}</h3>
      {description && <p className="empty-state-desc">{description}</p>}
      {action && <div className="empty-state-action">{action}</div>}
    </div>
  );
}

// ─── Confirm Dialog ──────────────────────────────────────────
export function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, confirmLabel = "Confirm", danger = false }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant={danger ? "danger" : "primary"} onClick={onConfirm}>{confirmLabel}</Button>
        </div>
      }
    >
      <p style={{ color: "var(--color-text-secondary)", margin: 0 }}>{message}</p>
    </Modal>
  );
}

// ─── Search Input ────────────────────────────────────────────
export function SearchInput({ value, onChange, placeholder = "Search...", className = "" }) {
  return (
    <div className={`search-input-wrap ${className}`}>
      <svg className="search-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
      <input
        type="text"
        className="search-input"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
      />
      {value && (
        <button className="search-clear" onClick={() => onChange("")}>✕</button>
      )}
    </div>
  );
}

// ─── PasswordInput ───────────────────────────────────────────
export function PasswordInput({ label, error, className = "", ...props }) {
  const [show, setShow] = useState(false);
  return (
    <Input
      label={label}
      error={error}
      className={className}
      type={show ? "text" : "password"}
      rightIcon={
        <button
          type="button"
          onClick={() => setShow(v => !v)}
          style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-muted)", display: "flex" }}
        >
          {show
            ? <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2 9s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.5"/><circle cx="9" cy="9" r="2" stroke="currentColor" strokeWidth="1.5"/><path d="M2 2l14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            : <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2 9s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.5"/><circle cx="9" cy="9" r="2" stroke="currentColor" strokeWidth="1.5"/></svg>
          }
        </button>
      }
      {...props}
    />
  );
}

import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { SCHOOL_CONFIG } from "../../theme";
import { Avatar,  ConfirmDialog } from "../common";

const NAV_ITEMS = [
  {
    key: "dashboard",
    label: "Dashboard",
    path: "/dashboard",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="2" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="11" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="2" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="11" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
    roles: ["Admin", "Teacher", "Student", "Parent"],
  },
  {
    key: "users",
    label: "Users",
    path: "/users",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="8" cy="6" r="3" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M2 17c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M14 8a3 3 0 0 1 0 6M16 17a4 4 0 0 0-2-3.46" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    roles: ["Admin", "Teacher"],
  },
  // Future menu items can be added here:
  // { key: "classes", label: "Classes", path: "/classes", icon: <...>, roles: ["Admin","Teacher"] },
  // { key: "attendance", label: "Attendance", path: "/attendance", icon: <...>, roles: ["Admin","Teacher","Student","Parent"] },
  // { key: "grades", label: "Grades", path: "/grades", icon: <...>, roles: ["Admin","Teacher","Student","Parent"] },
  // { key: "fees", label: "Fees", path: "/fees", icon: <...>, roles: ["Admin"] },
  // { key: "reports", label: "Reports", path: "/reports", icon: <...>, roles: ["Admin"] },
  // { key: "settings", label: "Settings", path: "/settings", icon: <...>, roles: ["Admin"] },
];

export function Sidebar({ activePage, onNavigate, collapsed, onToggle }) {
  const { user, logout } = useAuth();
  const [logoutOpen, setLogoutOpen] = useState(false);

  const visibleItems = NAV_ITEMS.filter(
    item => !item.roles || item.roles.includes(user?.role)
  );

  return (
    <aside className={`sidebar ${collapsed ? "sidebar-collapsed" : ""}`}>
      {/* Logo / School Branding */}
      <div className="sidebar-brand">
        <div className="sidebar-logo">
          {SCHOOL_CONFIG.logo
            ? <img src={SCHOOL_CONFIG.logo} alt={SCHOOL_CONFIG.name} />
            : <span className="sidebar-logo-initials">
                {SCHOOL_CONFIG.shortName}
              </span>
          }
        </div>
        {!collapsed && (
          <div className="sidebar-brand-text">
            <span className="sidebar-school-name">{SCHOOL_CONFIG.name}</span>
            <span className="sidebar-school-type">{SCHOOL_CONFIG.type}</span>
          </div>
        )}
        <button
          className={`sidebar-collapse-btn ${collapsed ? "sidebar-collapse-btn-solo" : ""}`}
          onClick={onToggle}
          title={collapsed ? "Expand" : "Collapse"}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M3 5h12M3 9h12M3 13h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {!collapsed && (
          <span className="sidebar-nav-label">MAIN MENU</span>
        )}
        <ul className="sidebar-nav-list">
          {visibleItems.map(item => (
            <li key={item.key}>
              <button
                className={`sidebar-nav-item ${activePage === item.key ? "active" : ""}`}
                onClick={() => onNavigate(item.key)}
                title={collapsed ? item.label : undefined}
              >
                <span className="sidebar-nav-icon">{item.icon}</span>
                {!collapsed && <span className="sidebar-nav-text">{item.label}</span>}
                {!collapsed && activePage === item.key && (
                  <span className="sidebar-nav-indicator" />
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* User section at bottom */}
      <div className="sidebar-user">
        <div className="sidebar-user-info">
          <Avatar name={user?.name} role={user?.role} size="sm" />
          {!collapsed && (
            <div className="sidebar-user-details">
              <span className="sidebar-user-name">{user?.name}</span>
              <span className="sidebar-user-role">{user?.role}</span>
            </div>
          )}
        </div>
        <button
          className="sidebar-logout-btn"
          onClick={() => setLogoutOpen(true)}
          title="Sign out"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M11 14v1a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h5a2 2 0 0 1 2 2v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M8 9h9m0 0-3-3m3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    <ConfirmDialog
        isOpen={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        onConfirm={logout}
        title="Sign Out"
        message="Are you sure you want to sign out of your account?"
        confirmLabel="Yes, Sign Out"
        danger
      />
    </aside>
  );
}
import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { useAuth } from "../../context/AuthContext";

export function AppShell({ activePage, onNavigate, children }) {
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const pageTitle = {
    dashboard: "Dashboard",
    users:     "Users",
  }[activePage] ?? "Page";

  return (
    <div className="app-shell">
      <Sidebar activePage={activePage} onNavigate={onNavigate} collapsed={collapsed} onToggle={() => setCollapsed(v => !v)} />

      <div className="app-main">
        {/* Top header bar */}
        <header className="app-header">
          <div className="app-header-left">
            <h2 className="app-header-title">{pageTitle}</h2>
          </div>
          <div className="app-header-right">
            <div className="header-user-chip">
              <div className="header-avatar">
                {(user?.name?.[0] ?? "U").toUpperCase()}
              </div>
              <div className="header-user-info">
                <span className="header-user-name">{user?.name}</span>
                <span className="header-user-role">{user?.role}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="app-content">
          {children}
        </main>
      </div>
    </div>
  );
}

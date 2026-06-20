import { useEffect, useState } from "react";
import { userService } from "../../services/api";
import { StatCard, Card } from "../../components/common";
import { useAuth } from "../../context/AuthContext";
import { SCHOOL_CONFIG } from "../../theme";

// Role-aware icons
const ICONS = {
  totalUsers: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <circle cx="10" cy="8" r="4" stroke="currentColor" strokeWidth="2"/>
      <path d="M2 24c0-4.418 3.582-8 8-8s8 3.582 8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="20" cy="9" r="3" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M20 16c2.761 0 5 1.791 5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  admins: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <path d="M14 3l2.5 5.5L22 9.5l-4 4 1 5.5L14 16l-5 3 1-5.5-4-4 5.5-1L14 3z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
    </svg>
  ),
  teachers: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect x="3" y="5" width="22" height="16" rx="2" stroke="currentColor" strokeWidth="2"/>
      <path d="M9 22h10M14 21v1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M8 12l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  students: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <path d="M14 4L4 10l10 6 10-6-10-6z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
      <path d="M4 10v7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M8 14v5c2 2 10 2 12 0v-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  parents: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <path d="M7 10c0-3.866 3.134-7 7-7s7 3.134 7 7" stroke="currentColor" strokeWidth="2"/>
      <path d="M4 22c0-4.418 4.477-8 10-8s10 3.582 10 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
};

const STAT_CONFIGS = [
  { key: "totalUsers",    label: "Total Users",  color: "primary",  icon: ICONS.totalUsers },
  { key: "totalAdmins",   label: "Admins",       color: "info",     icon: ICONS.admins },
  { key: "totalTeachers", label: "Teachers",     color: "success",  icon: ICONS.teachers },
  { key: "totalStudents", label: "Students",     color: "accent",   icon: ICONS.students },
  { key: "totalParents",  label: "Parents",      color: "warning",  icon: ICONS.parents },
];

export function DashboardPage({ onNavigate }) {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await userService.getDashboard();
        setDashboard(data);
        } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="page-fade-in">
      {/* Welcome banner */}
      <div className="dashboard-welcome">
        <div className="dashboard-welcome-text">
          <p className="dashboard-greeting">{greeting()},</p>
          <h2 className="dashboard-name">{user?.name} 👋</h2>
          <p className="dashboard-date">
            {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <div className="dashboard-welcome-badge">
          <span className="badge badge-role">{user?.role}</span>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" style={{ marginBottom: "1.5rem" }}>
          {error}
        </div>
      )}

      {/* Stats grid */}
      <section className="dashboard-section">
        <h3 className="section-title">Overview</h3>
        <div className="stats-grid">
          {STAT_CONFIGS.map(cfg => (
            <StatCard
              key={cfg.key}
              label={cfg.label}
              value={dashboard?.[cfg.key]}
              icon={cfg.icon}
              color={cfg.color}
              loading={loading}
            />
          ))}
        </div>
      </section>

      {/* Quick actions */}
      <section className="dashboard-section">
        <h3 className="section-title">Quick Actions</h3>
        <div className="quick-actions-grid">
          <button className="quick-action-card" onClick={() => onNavigate("users")}>
            <div className="qa-icon qa-icon-primary">{ICONS.totalUsers}</div>
            <span className="qa-label">Manage Users</span>
            <span className="qa-arrow">→</span>
          </button>
          {/* Placeholder future actions */}
          {[
            { label: "View Classes",     icon: "📚", soon: true },
            { label: "Attendance",       icon: "✅", soon: true },
            { label: "Fee Management",   icon: "💰", soon: true },
          ].map(qa => (
            <button key={qa.label} className="quick-action-card qa-disabled" disabled>
              <div className="qa-icon qa-icon-muted">{qa.icon}</div>
              <span className="qa-label">{qa.label}</span>
              <span className="qa-soon">Soon</span>
            </button>
          ))}
        </div>
      </section>

      {/* About school */}
      <section className="dashboard-section">
        <Card className="school-info-card">
          <div className="school-info-logo">{SCHOOL_CONFIG.shortName}</div>
          <div className="school-info-body">
            <h4 className="school-info-name">{SCHOOL_CONFIG.name}</h4>
            <p className="school-info-tagline">{SCHOOL_CONFIG.tagline}</p>
            <div className="school-info-meta">
              <span>📍 {SCHOOL_CONFIG.address}</span>
              <span>📞 {SCHOOL_CONFIG.phone}</span>
              <span>✉️ {SCHOOL_CONFIG.email}</span>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}

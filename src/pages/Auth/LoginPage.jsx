import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { authService } from "../../services/api";
import { Input, PasswordInput, Button } from "../../components/common";
import { SCHOOL_CONFIG, THEME } from "../../theme";

export function LoginPage({ onSuccess }) {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  function validate() {
    const e = {};
    if (!form.email) e.email = "Email is required";
    if (!form.password) e.password = "Password is required";
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setApiError("");
    setLoading(true);

    try {
      const data = await authService.login({
        email: form.email,
        password: form.password,
      });

      console.log("SUCCESS", data);

      login(data.token);
      onSuccess?.();
    }
    catch (err) {
      console.error(err);
      setApiError(err.message || "Invalid Email or Password");
    }
    finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      {/* Decorative left panel */}
      <div className="login-panel-left">
        <div className="login-panel-content">
          <div className="login-school-logo">
            <span>{SCHOOL_CONFIG.shortName}</span>
          </div>
          <h1 className="login-school-name">{SCHOOL_CONFIG.name}</h1>
          <p className="login-school-tagline">{SCHOOL_CONFIG.tagline}</p>

          {/* Decorative rings */}
          <div className="login-deco-ring ring-1" />
          <div className="login-deco-ring ring-2" />
          <div className="login-deco-ring ring-3" />

          {/* Stats row */}
          <div className="login-stats">
            {[
              { label: "Students", value: "1,200+" },
              { label: "Teachers", value: "85+" },
              { label: "Since", value: "1998" },
            ].map(s => (
              <div key={s.label} className="login-stat">
                <span className="login-stat-value">{s.value}</span>
                <span className="login-stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: login form */}
      <div className="login-panel-right">
        <div className="login-form-wrap">
          <div className="login-form-header">
            <h2 className="login-form-title">Welcome back</h2>
            <p className="login-form-subtitle">Sign in to your account to continue</p>
          </div>

          {apiError && (
            <div className="alert alert-danger">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
                <path d="M8 5v3M8 11v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form" noValidate>
            <Input
              label="Email address"
              type="email"
              placeholder="you@school.edu"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              error={errors.email}
              required
              leftIcon={
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="1" y="3" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M1 5.5l7 4 7-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              }
            />

            <PasswordInput
              label="Password"
              placeholder="Enter your password"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              error={errors.password}
              required
            />

            <div className="login-options">
              <label className="checkbox-label">
                <input type="checkbox" /> Remember me
              </label>
              <button type="button" className="link-btn">Forgot password?</button>
            </div>

            <Button
              type="submit"
              fullWidth
              size="lg"
              loading={loading}
            >
              Sign in
            </Button>
          </form>

          <p className="login-footer">
            {SCHOOL_CONFIG.name} — {SCHOOL_CONFIG.address}
          </p>
        </div>
      </div>
    </div>
  );
}

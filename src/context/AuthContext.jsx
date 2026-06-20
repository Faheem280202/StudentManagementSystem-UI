import { createContext, useContext, useState, useCallback } from "react";

const AuthContext = createContext(null);

const TOKEN_KEY = "sms_token";
const USER_KEY  = "sms_user";

function parseJwt(token) {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken]   = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user,  setUser]    = useState(() => {
    try { return JSON.parse(localStorage.getItem(USER_KEY)); } catch { return null; }
  });

  const login = useCallback((newToken) => {
    const payload = parseJwt(newToken);
    const userInfo = {
      id:       payload?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]
                ?? payload?.sub,
      name:     payload?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]
                ?? payload?.unique_name ?? "User",
      email:    payload?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"]
                ?? payload?.email ?? "",
      role:     payload?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]
                ?? payload?.role ?? "Student",
    };
    localStorage.setItem(TOKEN_KEY, newToken);
    localStorage.setItem(USER_KEY, JSON.stringify(userInfo));
    setToken(newToken);
    setUser(userInfo);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

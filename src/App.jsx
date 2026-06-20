import { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { LoginPage } from "./pages/Auth/LoginPage";
import { DashboardPage } from "./pages/Dashboard/DashboardPage";
import { UsersPage } from "./pages/Users/UsersPage";
import { AppShell } from "./components/layout/AppShell";
import { ToastContainer } from "./components/common";
import { useToast } from "./hooks";

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [page, setPage] = useState("dashboard");
  const { toasts, toast } = useToast();

  if (!isAuthenticated) {
    return (
      <>
        <LoginPage onSuccess={() => setPage("dashboard")} />
        <ToastContainer toasts={toasts} />
      </>
    );
  }

  const renderPage = () => {
    switch (page) {
      case "dashboard": return <DashboardPage onNavigate={setPage} />;
      case "users":     return <UsersPage onToast={toast} />;
      default:          return <DashboardPage onNavigate={setPage} />;
    }
  };

  return (
    <>
      <AppShell activePage={page} onNavigate={setPage}>
        {renderPage()}
      </AppShell>
      <ToastContainer toasts={toasts} />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

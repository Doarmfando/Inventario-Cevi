// src/app/App.tsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "../features/auth/providers/AuthProvider";
import { useAuth } from "../features/auth/hooks/useAuth";
import { useSessionDebug } from "../utils/sessionUtils";
import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import InventoryPage from "../pages/InventoryPage";
import MovementPage from "../pages/MovementPage";
import ReportsPage from "../pages/ReportsPage";
import ContainersPage from "../pages/ContainerPage/ContainersPage";
import ContainerProductsPage from "../pages/ContainerPage/ContainerProductsPage";
import { AdminPage } from "../pages/AdminPage";
import Sidebar from "../components/Sidebar/Sidebar";
import Header from "../components/Header/index";

// Memoizar PrivateLayout para evitar re-renders innecesarios
const PrivateLayout = React.memo<{ children: React.ReactNode }>(({ children }) => {
  const { user, logout, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  // Solo activar debug tools una vez
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      useSessionDebug();
    }
  }, []);

  // Mostrar loading mientras verifica auth
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando sesión...</p>
          {process.env.NODE_ENV === 'development' && (
            <p className="text-xs text-gray-400 mt-2">
              Abre la consola para ver logs de debugging
            </p>
          )}
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        user={user}
        onLogout={logout}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onToggle={() => setSidebarOpen(s => !s)}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          <Header user={user} onToggleSidebar={() => setSidebarOpen(s => !s)} />
          {children}
        </main>
      </div>
    </div>
  );
});

PrivateLayout.displayName = 'PrivateLayout';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/dashboard"
            element={
              <PrivateLayout>
                <DashboardPage />
              </PrivateLayout>
            }
          />

          <Route
            path="/inventory"
            element={
              <PrivateLayout>
                <InventoryPage />
              </PrivateLayout>
            }
          />

          <Route
            path="/movements"
            element={
              <PrivateLayout>
                <MovementPage />
              </PrivateLayout>
            }
          />

          <Route
            path="/containers"
            element={
              <PrivateLayout>
                <ContainersPage />
              </PrivateLayout>
            }
          />

          <Route
            path="/containers/:containerId/products"
            element={
              <PrivateLayout>
                <ContainerProductsPage />
              </PrivateLayout>
            }
          />

          <Route
            path="/admin"
            element={
              <PrivateLayout>
                <AdminPage />
              </PrivateLayout>
            }
          />

          <Route
            path="/reports"
            element={
              <PrivateLayout>
                <ReportsPage />
              </PrivateLayout>
            }
          />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
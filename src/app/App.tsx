import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./providers/AuthProvider";
import { useAuth } from "../features/auth/hooks/useAuth";
import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import InventoryPage from "../pages/InventoryPage";
import MovementPage from "../pages/MovementPage";
import ReportsPage from "../pages/ReportsPage";
import ContainersPage from "../pages/ContainerPage/ContainersPage";
import ContainerProductsPage from "../pages/ContainerPage/ContainerProductsPage";
import Sidebar from "../components/Sidebar/Sidebar";
import Header from "../components/Header";

const PrivateLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

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
        onToggle={() => setSidebarOpen((s) => !s)}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          <Header user={user} onToggleSidebar={() => setSidebarOpen((s) => !s)} />
          {children}
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter basename="/Inventario-Cevi">
      <AuthProvider>
        <Routes>
          {/* Ruta raíz - redirige a login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Ruta de login - pública */}
          <Route path="/login" element={<LoginPage />} />

          {/* Rutas privadas - requieren autenticación */}
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
            path="/reports"
            element={
              <PrivateLayout>
                <ReportsPage />
              </PrivateLayout>
            }
          />

          {/* 🆕 RUTAS DE CONTENEDORES */}
          <Route
            path="/containers"
            element={
              <PrivateLayout>
                <ContainersPage />
              </PrivateLayout>
            }
          />

          {/* 🔧 CORREGIDO: usar :id consistentemente */}
          <Route
            path="/containers/:id/products"
            element={
              <PrivateLayout>
                <ContainerProductsPage />
              </PrivateLayout>
            }
          />

          {/* Ruta catch-all - cualquier ruta no encontrada va a login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
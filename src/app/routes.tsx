import { Route, Routes, Navigate } from "react-router-dom";
import DashboardPage from "../pages/DashboardPage";
import InventoryPage from "../pages/InventoryPage";
import MovementPage from "../pages/MovementPage";
import ReportsPage from "../pages/ReportsPage";
import ContainersPage from "../pages/ContainerPage/ContainersPage";
import ContainerProductsPage from "../pages/ContainerPage/ContainerProductsPage";

export const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/dashboard" />} />
    <Route path="/dashboard" element={<DashboardPage />} />
    <Route path="/inventory" element={<InventoryPage />} />
    <Route path="/movements" element={<MovementPage />} />
    <Route path="/reports" element={<ReportsPage />} />
    
    {/* ✅ Nuevas rutas */}
    <Route path="/containers" element={<ContainersPage />} />
    <Route path="/containers/:id/products" element={<ContainerProductsPage />} />
  </Routes>
);
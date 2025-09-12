// ==============================================
// ARCHIVO: src/components/Sidebar/Sidebar.tsx
// Sidebar corregido SIN mocks de contenedores
// ==============================================
// src/components/Sidebar/Sidebar.tsx
import React, { useState } from "react";
import { Container } from "lucide-react"; // ← Quitar Plus import
import { NavLink } from "react-router-dom";
import SidebarHeader from "./components/SidebarHeader";
import NavItem from "./components/NavItem";
import UserProfile from "./components/UserProfile";
import { MAIN_NAV_ITEMS, ADMIN_NAV_ITEMS } from "./constants/sidebarConstants";
import type { SidebarProps } from "./types/sidebar.types";
import { useAuth } from "../../features/auth/hooks/useAuth";
import "./styles/sidebarStyles.css";

// ... resto del código igual

const Sidebar: React.FC<SidebarProps> = ({ 
  user, 
  onLogout, 
  open, 
  onClose
}) => {
  const isControlled = typeof open === "boolean";
  const [localOpen, setLocalOpen] = useState<boolean>(false);
  const { isAdmin } = useAuth();
  
  const visible = isControlled ? !!open : localOpen;

  const close = () => {
    if (onClose) onClose();
    else setLocalOpen(false);
  };

  return (
    <>
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-slate-900 to-slate-800 transform transition-all duration-300 ease-in-out flex flex-col
          ${visible ? "translate-x-0 shadow-2xl" : "-translate-x-full"} lg:translate-x-0 lg:static lg:inset-0 lg:shadow-lg border-r border-slate-700`}
      >
        {/* Header */}
        <SidebarHeader onClose={close} />

        {/* Navigation - Área principal con scroll */}
        <div className="flex-1 overflow-y-auto scrollbar-custom">
          <nav className="p-4 space-y-2">
            {/* Elementos de navegación principales */}
            {MAIN_NAV_ITEMS.map((item) => (
              <NavItem
                key={item.to}
                to={item.to}
                icon={item.icon}
                label={item.label}
                badge={item.badge}
                onClose={close}
              />
            ))}

            {/* Sección de contenedores simplificada */}
            <div className="pt-2">
              <NavLink
                to="/containers"
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-all duration-200 group ${
                    isActive 
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg" 
                      : "text-gray-300 hover:bg-slate-800 hover:text-white"
                  }`
                }
                onClick={close}
              >
                <Container className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                <span className="font-medium">Contenedores</span>
              </NavLink>
            </div>

            {/* Sección de administración - Solo para admins */}
            {isAdmin && (
              <div className="pt-4 border-t border-slate-700 mt-4">
                <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Administración
                </h3>
                {ADMIN_NAV_ITEMS.map((item) => (
                  <NavItem
                    key={item.to}
                    to={item.to}
                    icon={item.icon}
                    label={item.label}
                    onClose={close}
                  />
                ))}
              </div>
            )}
          </nav>
        </div>

        {/* User Profile - Siempre en la parte inferior */}
        <UserProfile user={user} onLogout={onLogout} />
      </div>

      {/* Overlay para móvil */}
      {visible && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden backdrop-blur-sm" 
          onClick={close} 
        />
      )}
    </>
  );
};

export default Sidebar;
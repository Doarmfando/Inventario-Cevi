// ==============================================
// ARCHIVO: src/components/Sidebar/Sidebar.tsx
// VERSIÓN ACTUALIZADA CON CONTENEDORES REALES
// ==============================================
import React, { useState } from "react";
import SidebarHeader from "./components/SidebarHeader";
import NavItem from "./components/NavItem";
import UserProfile from "./components/UserProfile";
import ContainersSection from "./components/ContainersSection";
import { MAIN_NAV_ITEMS, ADMIN_NAV_ITEMS } from "./constants/sidebarConstants";
import { useContainers } from "./hooks/useContainers";
import type { SidebarProps } from "./types/sidebar.types";
import { useAuth } from "../../features/auth/hooks/useAuth";
import "./styles/sidebarStyles.css";

const Sidebar: React.FC<SidebarProps> = ({ 
  user, 
  onLogout, 
  open, 
  onClose
}) => {
  const isControlled = typeof open === "boolean";
  const [localOpen, setLocalOpen] = useState<boolean>(false);
  const [containersExpanded, setContainersExpanded] = useState<boolean>(false);
  const { isAdmin } = useAuth();
  const { containers, loading: loadingContainers } = useContainers();
  
  const visible = isControlled ? !!open : localOpen;

  const close = () => {
    if (onClose) onClose();
    else setLocalOpen(false);
  };

  // Adaptar logout para que siempre sea async
  const handleLogout = async () => {
    await Promise.resolve(onLogout?.());
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

            {/* Sección de contenedores con datos reales */}
            <div className="pt-2">
              {loadingContainers ? (
                <div className="flex items-center space-x-3 px-4 py-3 text-gray-400">
                  <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                  <span className="font-medium">Cargando contenedores...</span>
                </div>
              ) : (
                <ContainersSection
                  containers={containers}
                  containersExpanded={containersExpanded}
                  setContainersExpanded={setContainersExpanded}
                  onClose={close}
                />
              )}
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

        {/* User Profile */}
        <UserProfile user={user} onLogout={handleLogout} />
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
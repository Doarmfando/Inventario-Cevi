// src/components/Sidebar/Sidebar.tsx
import React, { useState, useEffect } from "react";
import SidebarHeader from "./components/SidebarHeader";
import NavItem from "./components/NavItem";
import ContainersSection from "./components/ContainersSection";
import UserProfile from "./components/UserProfile";
import { MAIN_NAV_ITEMS } from "./constants/sidebarConstants";
import { getContainersSummary } from "../../features/containers/data/mockContainerData";
import type { ContainerSummary } from "../../features/containers/types/container.types";
import type { SidebarProps } from "./types/sidebar.types";
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
  const [containers, setContainers] = useState<ContainerSummary[]>([]);
  
  const visible = isControlled ? !!open : localOpen;

  // Cargar contenedores
  useEffect(() => {
    const containerData = getContainersSummary();
    setContainers(containerData);
  }, []);

  // Función para recargar contenedores
  const reloadContainers = () => {
    const containerData = getContainersSummary();
    setContainers(containerData);
  };

  // Exponer la función globalmente
  React.useEffect(() => {
    (window as any).reloadSidebarContainers = reloadContainers;
    return () => {
      delete (window as any).reloadSidebarContainers;
    };
  }, []);

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

            {/* Sección de contenedores */}
            <div className="pt-2">
              <ContainersSection
                containers={containers}
                containersExpanded={containersExpanded}
                setContainersExpanded={setContainersExpanded}
                onClose={close}
              />
            </div>
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
// src/components/Sidebar.tsx
import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  User,
  Package,
  LogOut,
  X,
  BarChart3,
  ArrowUpDown,
  FileText,
  Container,
  ChevronDown,
  ChevronRight,
  Thermometer,
  Snowflake,
  Warehouse,
  Droplets
} from "lucide-react";
import { getContainersSummary } from "../features/containers/data/mockContainerData";
import type { ContainerSummary } from "../features/containers/types/container.types";
import logo2 from "../assets/logo2.png";

interface SidebarProps {
  user: string;
  onLogout: () => void;
  open?: boolean;
  onClose?: () => void;
  onToggle?: () => void;
}

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

  // Función para recargar contenedores (se llamará cuando se agregue uno nuevo)
  const reloadContainers = () => {
    const containerData = getContainersSummary();
    setContainers(containerData);
  };

  // Exponer la función globalmente para que otros componentes puedan usarla
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

  const getContainerIcon = (type: string) => {
    switch (type) {
      case 'frigider':
        return <Thermometer className="w-4 h-4 text-blue-500" />;
      case 'congelador':
        return <Snowflake className="w-4 h-4 text-cyan-500" />;
      case 'almacen-seco':
        return <Warehouse className="w-4 h-4 text-amber-500" />;
      case 'almacen-humedo':
        return <Droplets className="w-4 h-4 text-blue-600" />;
      default:
        return <Container className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'activo':
        return 'bg-green-400';
      case 'mantenimiento':
        return 'bg-yellow-400';
      case 'inactivo':
        return 'bg-red-400';
      default:
        return 'bg-gray-400';
    }
  };

  // Agrupar contenedores por tipo
  const containersByType = containers.reduce((acc, container) => {
    if (!acc[container.type]) {
      acc[container.type] = [];
    }
    acc[container.type].push(container);
    return acc;
  }, {} as Record<string, ContainerSummary[]>);

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'frigider':
        return 'Refrigeradores';
      case 'congelador':
        return 'Congeladores';
      case 'almacen-seco':
        return 'Almacén Seco';
      case 'almacen-humedo':
        return 'Almacén Húmedo';
      default:
        return type;
    }
  };

  return (
    <>
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 transform transition-transform duration-300 ease-in-out overflow-y-auto
          ${visible ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex items-center justify-between h-16 px-6 bg-slate-800 flex-shrink-0">
          <div className="flex items-center space-x-2">
            <img 
              src={logo2} 
              alt="Logo" 
              className="w-8 h-8 object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <div className="w-8 h-8 bg-blue-400 rounded flex items-center justify-center text-white font-bold text-sm hidden">
              L
            </div>
            <span className="text-xl font-bold text-white">Inventario</span>
          </div>

          <button onClick={close} className="lg:hidden text-white hover:text-gray-300">
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="mt-4 px-4 flex-1">
          <div className="space-y-1">
            {/* Dashboard */}
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors ${
                  isActive ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-slate-800"
                }`
              }
              onClick={close}
            >
              <BarChart3 className="w-5 h-5" />
              <span>Dashboard</span>
            </NavLink>

            {/* Inventario */}
            <NavLink
              to="/inventory"
              className={({ isActive }) =>
                `w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors ${
                  isActive ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-slate-800"
                }`
              }
              onClick={close}
            >
              <Package className="w-5 h-5" />
              <span>Inventario</span>
            </NavLink>

            {/* Contenedores con Desplegable */}
            <div className="space-y-1">
              <div className="flex items-center">
                <NavLink
                  to="/containers"
                  className={({ isActive }) =>
                    `flex-1 flex items-center space-x-3 px-4 py-3 text-left rounded-l-lg transition-colors ${
                      isActive ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-slate-800"
                    }`
                  }
                  onClick={close}
                >
                  <Container className="w-5 h-5" />
                  <span>Contenedores</span>
                  {containers.length > 0 && (
                    <span className="ml-auto bg-slate-700 text-xs px-2 py-1 rounded-full">
                      {containers.length}
                    </span>
                  )}
                </NavLink>
                
                {containers.length > 0 && (
                  <button
                    onClick={() => setContainersExpanded(!containersExpanded)}
                    className="px-2 py-3 text-gray-300 hover:bg-slate-800 rounded-r-lg transition-colors"
                  >
                    {containersExpanded ? 
                      <ChevronDown className="w-4 h-4" /> : 
                      <ChevronRight className="w-4 h-4" />
                    }
                  </button>
                )}
              </div>

              {/* Lista de Contenedores */}
              {containersExpanded && containers.length > 0 && (
                <div className="ml-4 space-y-1 max-h-64 overflow-y-auto">
                  {Object.entries(containersByType).map(([type, typeContainers]) => (
                    <div key={type} className="space-y-1">
                      {/* Título del tipo de contenedor */}
                      <div className="px-4 py-1 text-xs font-medium text-gray-400 uppercase tracking-wider">
                        {getTypeLabel(type)}
                      </div>
                      
                      {/* Contenedores de este tipo */}
                      {typeContainers.slice(0, 4).map((container) => (
                        <NavLink
                          key={container.id}
                          to={`/containers/${container.id}/products`}
                          className={({ isActive }) =>
                            `w-full flex items-center space-x-3 px-4 py-2 text-left rounded-lg transition-colors text-sm ${
                              isActive ? "bg-blue-500 text-white" : "text-gray-400 hover:bg-slate-800 hover:text-gray-300"
                            }`
                          }
                          onClick={close}
                        >
                          {getContainerIcon(container.type)}
                          <span className="flex-1 truncate">{container.name}</span>
                          <div className="flex items-center space-x-1">
                            {/* Indicador de estado */}
                            <div className={`w-2 h-2 rounded-full ${getStatusColor(container.status)}`}></div>
                            {/* Número de productos */}
                            {container.stats.totalProducts > 0 && (
                              <span className="text-xs bg-slate-700 px-1 py-0.5 rounded">
                                {container.stats.totalProducts}
                              </span>
                            )}
                            {/* Alertas */}
                            {(container.stats.vencidos > 0 || container.stats.porVencer > 0) && (
                              <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                            )}
                          </div>
                        </NavLink>
                      ))}
                      
                      {/* Si hay más de 4 contenedores del mismo tipo */}
                      {typeContainers.length > 4 && (
                        <div className="px-4 py-2 text-xs text-gray-500 italic">
                          +{typeContainers.length - 4} más...
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {/* Enlace para ver todos */}
                  <NavLink
                    to="/containers"
                    className="w-full flex items-center justify-center px-4 py-2 text-xs text-blue-400 hover:text-blue-300 hover:bg-slate-800 rounded-lg transition-colors border border-slate-700 border-dashed"
                    onClick={close}
                  >
                    Ver todos los contenedores
                  </NavLink>
                </div>
              )}
            </div>

            {/* Movimientos */}
            <NavLink
              to="/movements"
              className={({ isActive }) =>
                `w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors ${
                  isActive ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-slate-800"
                }`
              }
              onClick={close}
            >
              <ArrowUpDown className="w-5 h-5" />
              <span>Movimientos</span>
            </NavLink>

            {/* Reportes */}
            <NavLink
              to="/reports"
              className={({ isActive }) =>
                `w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors ${
                  isActive ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-slate-800"
                }`
              }
              onClick={close}
            >
              <FileText className="w-5 h-5" />
              <span>Reportes</span>
            </NavLink>
          </div>
        </nav>

        {/* User Section */}
        <div className="flex-shrink-0 p-4 border-t border-slate-800">
          <div className="bg-slate-800 rounded-lg p-4 mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-medium">{user}</p>
                <p className="text-gray-400 text-sm">Administrador</p>
              </div>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>

      {/* Overlay para móvil */}
      {visible && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={close} />}
    </>
  );
};

export default Sidebar;
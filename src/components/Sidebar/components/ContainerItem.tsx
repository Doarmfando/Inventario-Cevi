// src/components/Sidebar/components/ContainerItem.tsx
import React from "react";
import { NavLink } from "react-router-dom";
import type { ContainerItemProps } from "../types/sidebar.types";

const ContainerItem: React.FC<ContainerItemProps> = ({ 
  container, 
  onClose, 
  getContainerIcon, 
  getStatusColor 
}) => {
  return (
    <NavLink
      to={`/containers/${container.id}/products`}
      className={({ isActive }) =>
        `w-full flex items-center space-x-3 px-4 py-2.5 text-left rounded-lg transition-all duration-200 text-sm group ${
          isActive 
            ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md" 
            : "text-gray-400 hover:bg-slate-800 hover:text-gray-200"
        }`
      }
      onClick={onClose}
    >
      <div className="group-hover:scale-110 transition-transform duration-200">
        {getContainerIcon(container.type)}
      </div>
      <span className="flex-1 truncate font-medium">{container.name}</span>
      <div className="flex items-center space-x-2">
        {/* Indicador de estado */}
        <div className={`w-2 h-2 rounded-full ${getStatusColor(container.status)} shadow-sm`}></div>
        
        {/* Número de productos */}
        {container.stats.totalProducts > 0 && (
          <span className="text-xs bg-slate-700 text-gray-300 px-2 py-0.5 rounded-full border border-slate-600">
            {container.stats.totalProducts}
          </span>
        )}
        
        {/* Alertas */}
        {(container.stats.vencidos > 0 || container.stats.porVencer > 0) && (
          <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse shadow-sm"></div>
        )}
      </div>
    </NavLink>
  );
};

export default ContainerItem;
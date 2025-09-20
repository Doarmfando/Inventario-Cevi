// ==============================================
// ARCHIVO: src/components/Sidebar/components/ContainersSection.tsx
// ==============================================
import React from "react";
import { NavLink } from "react-router-dom";
import { Container, ChevronDown, ChevronRight } from "lucide-react";
import ContainerItem from "./ContainerItem";
import { getContainerIcon, getStatusColor, getTypeLabel, groupContainersByType } from "../utils/sidebarUtils";
import type { ContainerSummary } from "../types/sidebar.types";

interface ContainersSectionProps {
  containers: ContainerSummary[];
  containersExpanded: boolean;
  setContainersExpanded: (expanded: boolean) => void;
  onClose: () => void;
}

const ContainersSection: React.FC<ContainersSectionProps> = ({ 
  containers, 
  containersExpanded, 
  setContainersExpanded, 
  onClose 
}) => {
  const containersByType = groupContainersByType(containers);
  const maxContainersToShow = 4;

  return (
    <div className="space-y-1">
      <div className="flex items-center">
        <NavLink
          to="/containers"
          className={({ isActive }) =>
            `flex-1 flex items-center space-x-3 px-4 py-3 text-left rounded-l-lg transition-all duration-200 group ${
              isActive 
                ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg" 
                : "text-gray-300 hover:bg-slate-800 hover:text-white"
            }`
          }
          onClick={onClose}
        >
          <Container className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
          <span className="font-medium">Contenedores</span>
          {containers.length > 0 && (
            <span className="ml-auto bg-slate-700 text-gray-300 text-xs px-2 py-1 rounded-full border border-slate-600">
              {containers.length}
            </span>
          )}
        </NavLink>
        
        {containers.length > 0 && (
          <button
            onClick={() => setContainersExpanded(!containersExpanded)}
            className="px-3 py-3 text-gray-300 hover:bg-slate-800 hover:text-white rounded-r-lg transition-all duration-200 group"
          >
            {containersExpanded ? 
              <ChevronDown className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" /> : 
              <ChevronRight className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
            }
          </button>
        )}
      </div>

      {/* Lista de Contenedores expandible */}
      {containersExpanded && containers.length > 0 && (
        <div className="ml-4 space-y-2 max-h-80 overflow-y-auto scrollbar-custom">
          {Object.entries(containersByType).map(([type, typeContainers]) => (
            <div key={type} className="space-y-1">
              {/* Título del tipo de contenedor */}
              <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider bg-slate-800/50 rounded-md">
                {getTypeLabel(type)} ({typeContainers.length})
              </div>
              
              {/* Contenedores de este tipo */}
              <div className="space-y-1">
                {typeContainers.slice(0, maxContainersToShow).map((container) => (
                  <ContainerItem
                    key={container.id}
                    container={container}
                    onClose={onClose}
                    getContainerIcon={getContainerIcon}
                    getStatusColor={getStatusColor}
                  />
                ))}
                
                {/* Si hay más contenedores del mismo tipo */}
                {typeContainers.length > maxContainersToShow && (
                  <div className="px-4 py-2 text-xs text-gray-500 italic bg-slate-800/30 rounded-md">
                    +{typeContainers.length - maxContainersToShow} contenedores más...
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {/* Enlace para ver todos */}
          <div className="pt-2 border-t border-slate-700">
            <NavLink
              to="/containers"
              className="w-full flex items-center justify-center px-4 py-3 text-sm text-blue-400 hover:text-blue-300 hover:bg-slate-800 rounded-lg transition-all duration-200 border border-slate-700 border-dashed hover:border-blue-500"
              onClick={onClose}
            >
              Ver todos los contenedores
            </NavLink>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContainersSection;
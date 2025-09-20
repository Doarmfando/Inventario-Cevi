// ==============================================
// ARCHIVO: src/components/Sidebar/utils/sidebarUtils.tsx
// ==============================================
import { Snowflake, Refrigerator, Package, Container } from "lucide-react";
import type { ContainerSummary, ContainerStats } from "../types/sidebar.types";
import type { ReactElement } from "react";

export const getContainerIcon = (type: string): ReactElement => {
  const iconClass = "w-4 h-4";
  
  switch (type.toLowerCase()) {
    case 'congelador':
      return <Snowflake className={iconClass} />;
    case 'refrigerador':
      return <Refrigerator className={iconClass} />;
    case 'almacén seco':
    case 'almacen seco':
      return <Package className={iconClass} />;
    default:
      return <Container className={iconClass} />;
  }
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'active':
      return 'bg-green-400';
    case 'warning':
      return 'bg-yellow-400';
    case 'error':
      return 'bg-red-400';
    case 'inactive':
      return 'bg-gray-400';
    default:
      return 'bg-gray-400';
  }
};

export const getTypeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    'congelador': 'Congeladores',
    'refrigerador': 'Refrigeradores',
    'almacén seco': 'Almacén Seco',
    'almacen seco': 'Almacén Seco'
  };
  
  return labels[type.toLowerCase()] || type;
};

export const groupContainersByType = (containers: ContainerSummary[]): Record<string, ContainerSummary[]> => {
  return containers.reduce((groups, container) => {
    const type = container.type.toLowerCase();
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push(container);
    return groups;
  }, {} as Record<string, ContainerSummary[]>);
};

// Función para determinar el estado del contenedor basado en sus stats
export const calculateContainerStatus = (stats: ContainerStats): 'active' | 'warning' | 'error' | 'inactive' => {
  if (stats.vencidos > 0) return 'error';
  if (stats.porVencer > 0 || stats.stockBajo > 0) return 'warning';
  if (stats.totalProducts > 0) return 'active';
  return 'inactive';
};

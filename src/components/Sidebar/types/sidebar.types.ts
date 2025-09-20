// ==============================================
// ARCHIVO: src/components/Sidebar/types/sidebar.types.ts
// ==============================================
import type { LucideIcon } from "lucide-react";
import type { User } from "../../../features/auth/types";
import type { ReactElement } from "react";

export interface SidebarProps {
  user: User;
  onLogout: () => void;
  open?: boolean;
  onClose?: () => void;
  onToggle?: () => void;
}

export interface NavItem {
  to: string;
  icon: LucideIcon;
  label: string;
  badge?: number;
}

// Tipos para contenedores
export interface ContainerStats {
  totalProducts: number;
  vencidos: number;
  porVencer: number;
  stockBajo: number;
}

export interface ContainerSummary {
  id: string;
  name: string;
  code: string;
  type: string;
  typeId: string;
  status: 'active' | 'warning' | 'error' | 'inactive';
  stats: ContainerStats;
  capacity?: number;
  description?: string;
}

export interface ContainerItemProps {
  container: ContainerSummary;
  onClose: () => void;
  getContainerIcon: (type: string) => ReactElement;
  getStatusColor: (status: string) => string;
}
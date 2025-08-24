// src/components/Sidebar/types/sidebar.types.ts
import type { ContainerSummary } from "../../../features/containers/types/container.types";

export interface SidebarProps {
  user: string;
  onLogout: () => void;
  open?: boolean;
  onClose?: () => void;
  onToggle?: () => void;
}

export interface NavItem {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  badge?: number;
}

export interface ContainersByType {
  [key: string]: ContainerSummary[];
}

export interface ContainerItemProps {
  container: ContainerSummary;
  onClose: () => void;
  getContainerIcon: (type: string) => React.ReactNode;
  getStatusColor: (status: string) => string;
}
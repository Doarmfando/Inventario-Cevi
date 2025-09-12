
// ==============================================
// ARCHIVO: src/components/Sidebar/types/sidebar.types.ts
// Tipos corregidos para el sidebar
// ==============================================

import type { LucideIcon } from "lucide-react";
import type { User } from "../../../features/auth/types";

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

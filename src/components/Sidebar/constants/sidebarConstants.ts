// ==============================================
// ARCHIVO: src/components/Sidebar/constants/sidebarConstants.ts
// Constantes actualizadas para el sidebar
// ==============================================

import {
  BarChart3,
  Package,
  ArrowUpDown,
  FileText,
  Shield
} from "lucide-react";
import type { NavItem } from "../types/sidebar.types";

export const MAIN_NAV_ITEMS: NavItem[] = [
  {
    to: "/dashboard",
    icon: BarChart3,
    label: "Dashboard"
  },
  {
    to: "/inventory",
    icon: Package,
    label: "Inventario"
  },
  {
    to: "/movements",
    icon: ArrowUpDown,
    label: "Movimientos"
  },
  {
    to: "/reports",
    icon: FileText,
    label: "Reportes"
  }
];

export const ADMIN_NAV_ITEMS: NavItem[] = [
  {
    to: "/admin",
    icon: Shield,
    label: "Roles y Permisos"
  }
];

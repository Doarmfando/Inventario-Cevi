// src/components/Sidebar/constants/sidebarConstants.ts
import {
  BarChart3,
  Package,
  Container,
  ArrowUpDown,
  FileText,
  Thermometer,
  Snowflake,
  Warehouse,
  Droplets
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

export const CONTAINER_ICONS = {
  frigider: { icon: Thermometer, color: "text-blue-500" },
  congelador: { icon: Snowflake, color: "text-cyan-500" },
  "almacen-seco": { icon: Warehouse, color: "text-amber-500" },
  "almacen-humedo": { icon: Droplets, color: "text-blue-600" },
  default: { icon: Container, color: "text-gray-500" }
};

export const CONTAINER_STATUS_COLORS = {
  activo: "bg-green-400",
  mantenimiento: "bg-yellow-400",
  inactivo: "bg-red-400",
  default: "bg-gray-400"
};

export const CONTAINER_TYPE_LABELS = {
  frigider: "Refrigeradores",
  congelador: "Congeladores",
  "almacen-seco": "Almacén Seco",
  "almacen-humedo": "Almacén Húmedo"
};
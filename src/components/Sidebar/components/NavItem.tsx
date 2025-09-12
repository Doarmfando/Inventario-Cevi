// ==============================================
// ARCHIVO: src/components/Sidebar/components/NavItem.tsx
// Componente NavItem corregido
// ==============================================

import React from "react";
import { NavLink } from "react-router-dom";
import type { LucideIcon } from "lucide-react";

interface NavItemProps {
  to: string;
  icon: LucideIcon;
  label: string;
  badge?: number;
  onClose: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon: Icon, label, badge, onClose }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-all duration-200 group ${
          isActive 
            ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg" 
            : "text-gray-300 hover:bg-slate-800 hover:text-white"
        }`
      }
      onClick={onClose}
    >
      <Icon className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
      <span className="font-medium">{label}</span>
      {badge && badge > 0 && (
        <span className="ml-auto bg-blue-500 text-white text-xs px-2 py-1 rounded-full min-w-[20px] text-center">
          {badge}
        </span>
      )}
    </NavLink>
  );
};

export default NavItem;
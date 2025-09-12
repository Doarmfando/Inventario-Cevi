// src/components/Header/index.tsx (crear carpeta y archivo)
import React from "react";
import { Menu, Bell, Search } from "lucide-react";
import type { User } from "../../features/auth/types";

interface HeaderProps {
  user: User;
  onToggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onToggleSidebar }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-4">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="hidden md:flex items-center space-x-2">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar productos, contenedores..."
              className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-400 hover:text-gray-500 transition-colors">
            <Bell className="w-5 h-5" />
          </button>
          
          <div className="text-sm text-gray-700">
            Hola, <span className="font-semibold">{user.nombre || user.nombre_usuario}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
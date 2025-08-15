import React from "react";
import { Menu } from "lucide-react";
import { useLocation } from "react-router-dom";

interface HeaderProps {
  user?: string;
  onToggleSidebar?: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onToggleSidebar }) => {
  const location = useLocation();
  const title = location.pathname.includes("/inventory") ? "Gestión de Inventario" : "Panel de Control";

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-6">
        <div className="flex items-center space-x-4">
          <button onClick={onToggleSidebar} className="lg:hidden text-gray-600 hover:text-gray-800">
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800 capitalize">{title}</h1>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden md:block">
            <p className="text-sm text-gray-600">
              Bienvenido, <span className="font-medium text-gray-800">{user}</span>
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

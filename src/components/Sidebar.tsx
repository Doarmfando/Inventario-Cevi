import React from "react";
import { NavLink } from "react-router-dom";
import {
  User,
  Package,
  LogOut,
  X,
  BarChart3,
  Package2
} from "lucide-react";

interface SidebarProps {
  user: string;
  onLogout: () => void;
  // control opcional desde el layout padre (para mobile)
  open?: boolean;
  onClose?: () => void;
  onToggle?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ user, onLogout, open, onClose, onToggle }) => {
  // si no viene 'open' controlado desde afuera, manejamos su propio state
  const isControlled = typeof open === "boolean";
  const [localOpen, setLocalOpen] = React.useState<boolean>(false);
  const visible = isControlled ? !!open : localOpen;

  const toggle = () => {
    if (onToggle) onToggle();
    else setLocalOpen((s) => !s);
  };
  const close = () => {
    if (onClose) onClose();
    else setLocalOpen(false);
  };

  return (
    <>
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 transform transition-transform duration-300 ease-in-out
          ${visible ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex items-center justify-between h-16 px-6 bg-slate-800">
          <div className="flex items-center space-x-2">
            <Package2 className="w-8 h-8 text-blue-400" />
            <span className="text-xl font-bold text-white">Inventario</span>
          </div>

          <button onClick={close} className="lg:hidden text-white hover:text-gray-300">
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="mt-8 px-4">
          <div className="space-y-2">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors ${
                  isActive ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-slate-800"
                }`
              }
              onClick={close}
            >
              <BarChart3 className="w-5 h-5" />
              <span>Dashboard</span>
            </NavLink>

            <NavLink
              to="/inventory"
              className={({ isActive }) =>
                `w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors ${
                  isActive ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-slate-800"
                }`
              }
              onClick={close}
            >
              <Package className="w-5 h-5" />
              <span>Inventario</span>
            </NavLink>
          </div>
        </nav>

        <div className="absolute bottom-4 w-full px-4">
          <div className="bg-slate-800 rounded-lg p-4 mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-medium">{user}</p>
                <p className="text-gray-400 text-sm">Administrador</p>
              </div>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>

      {/* overlay para móvil — solo cuando el sidebar esté visible (y en lg no) */}
      {visible && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={close} />}
    </>
  );
};

export default Sidebar;

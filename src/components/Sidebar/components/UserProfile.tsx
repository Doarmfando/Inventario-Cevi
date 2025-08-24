// src/components/Sidebar/components/UserProfile.tsx
import React from "react";
import { User, LogOut } from "lucide-react";

interface UserProfileProps {
  user: string;
  onLogout: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onLogout }) => {
  return (
    <div className="flex-shrink-0 p-4 border-t border-slate-700 bg-slate-800/50">
      {/* Información del usuario */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-xl p-4 mb-3 border border-slate-600/50 shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-11 h-11 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
              <User className="w-6 h-6 text-white" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-slate-800 rounded-full"></div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-sm truncate">{user}</p>
            <p className="text-gray-400 text-xs font-medium">Administrador</p>
          </div>
        </div>
      </div>

      {/* Botón de cerrar sesión */}
      <button
        onClick={onLogout}
        className="w-full flex items-center space-x-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-200 border border-red-500/20 hover:border-red-500/40 group"
      >
        <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
        <span className="font-medium">Cerrar Sesión</span>
      </button>
    </div>
  );
};

export default UserProfile;
// C:\Users\Brando\Documents\Working\Noemí\inventoryVITE-system\src\components\Sidebar\components\SidebarHeader.tsx
import React from "react";
import { X } from "lucide-react";
import logo2 from "../../../assets/logo2.png";

interface SidebarHeaderProps {  // ← Cambiar nombre del interface
  onClose: () => void;
}

const SidebarHeader: React.FC<SidebarHeaderProps> = ({ onClose }) => {
  return (
    <div className="flex items-center justify-between h-16 px-6 bg-slate-800 flex-shrink-0 border-b border-slate-700">
      <div className="flex items-center space-x-3">
        <div className="relative">
          <img 
            src={logo2} 
            alt="Logo" 
            className="w-8 h-8 object-contain"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const fallback = e.currentTarget.nextElementSibling as HTMLElement;
              fallback?.classList.remove('hidden');
            }}
          />
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm hidden shadow-lg">
            I
          </div>
        </div>
        <span className="text-xl font-bold text-white">Inventario</span>
      </div>

      <button 
        onClick={onClose} 
        className="lg:hidden text-gray-300 hover:text-white hover:bg-slate-700 p-1.5 rounded-md transition-colors"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
};

export default SidebarHeader;
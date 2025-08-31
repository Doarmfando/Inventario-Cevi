import React from "react";
import { X, Package } from "lucide-react";

interface FormHeaderProps {
  onClose: () => void;
  title?: string;
  subtitle?: string;
}

const FormHeader: React.FC<FormHeaderProps> = ({ 
  onClose, 
  title = "Crear Producto",
  subtitle = "Complete la información del nuevo producto"
}) => {
  return (
    <div className="flex items-center justify-between p-6 border-b border-gray-200">
      <div className="flex items-center space-x-3">
        <div className="bg-green-100 p-2 rounded-lg">
          <Package className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
      </div>
      <button
        onClick={onClose}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <X className="w-5 h-5 text-gray-500" />
      </button>
    </div>
  );
};

export default FormHeader;
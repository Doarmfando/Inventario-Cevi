import React from "react";
import { Package } from "lucide-react";

interface FormActionsProps {
  onCancel: () => void;
  submitText?: string;
  cancelText?: string;
}

const FormActions: React.FC<FormActionsProps> = ({ 
  onCancel, 
  submitText = "Crear Producto",
  cancelText = "Cancelar"
}) => {
  return (
    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
      <button
        type="button"
        onClick={onCancel}
        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
      >
        {cancelText}
      </button>
      <button
        type="submit"
        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
      >
        <Package className="w-4 h-4" />
        <span>{submitText}</span>
      </button>
    </div>
  );
};

export default FormActions;
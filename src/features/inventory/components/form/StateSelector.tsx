// form/StateSelector.tsx - CORREGIDO PARA BD
import React from "react";
import type { FormularioProducto } from "../../types";

interface StateSelectorProps {
  form: FormularioProducto;
  onChange: (field: keyof FormularioProducto) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const StateSelector: React.FC<StateSelectorProps> = ({  }) => {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-start space-x-2">
        <div className="bg-blue-100 p-1 rounded-full mt-0.5">
          <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="text-sm text-blue-800">
          <p className="font-medium">Estados del producto:</p>
          <p>• Los estados (fresco, congelado, por vencer, vencido) se manejan en detalle_contenedor</p>
          <p>• Cada lote en un contenedor puede tener un estado diferente</p>
          <p>• Los estados se asignan cuando se registra stock en movimientos</p>
        </div>
      </div>
    </div>
  );
};

export default StateSelector;
// form/QuantityPriceSection.tsx - CORREGIDO PARA BD
import React from "react";
import { DollarSign, Package2, BarChart3 } from "lucide-react";
import FormField from "./FormField";
import type { FormularioProducto } from "../../types";

interface QuantityPriceSectionProps {
  form: FormularioProducto;
  errors: Record<string, string>;
  onChange: (field: keyof FormularioProducto) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const QuantityPriceSection: React.FC<QuantityPriceSectionProps> = ({ 
  form, 
  errors, 
  onChange 
}) => {
  return (
    <div className="space-y-6">
      {/* Sección: Información de Stock */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
          Información de Stock
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Precio estimado */}
          <FormField
            label="Precio Unitario Estimado (S/)"
            error={errors.precio_estimado}
            required
            icon={DollarSign}
          >
            <input
              type="number"
              value={form.precio_estimado}
              onChange={onChange("precio_estimado")}
              min="0"
              step="0.01"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                errors.precio_estimado ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="0.00"
            />
          </FormField>

          {/* Stock mínimo */}
          <FormField
            label="Stock Mínimo"
            error={errors.stock_min}
            required
          >
            <input
              type="number"
              value={form.stock_min}
              onChange={onChange("stock_min")}
              min="0"
              step="1"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                errors.stock_min ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="0"
            />
          </FormField>
        </div>
      </div>

      {/* Información sobre el flujo */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-2">
          <div className="bg-blue-100 p-1 rounded-full mt-0.5">
            <Package2 className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-sm text-blue-800">
            <p className="font-medium">Proceso de registro simplificado:</p>
            <p>• El stock inicial será 0 y se llenará con movimientos de entrada</p>
            <p>• Los empaquetados se manejan en detalle_contenedor</p>
            <p>• El precio real se actualizará con las compras</p>
            <p>• La información de vencimiento se registra por lote en contenedores</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuantityPriceSection;
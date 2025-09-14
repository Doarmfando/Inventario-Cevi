// form/SupplierDateSection.tsx - CORREGIDO PARA BD
import React from "react";
import { Truck } from "lucide-react";
import FormField from "./FormField";
import type { FormularioProducto } from "../../types";

interface SupplierDateSectionProps {
  form: FormularioProducto;
  errors: Record<string, string>;
  onChange: (field: keyof FormularioProducto) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const SupplierDateSection: React.FC<SupplierDateSectionProps> = ({ 
  form, 
  errors, 
  onChange 
}) => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <p className="text-sm text-gray-600 mb-4">
        Información adicional del producto (opcional)
      </p>
      
      <div className="grid grid-cols-1 gap-4">
        {/* Descripción */}
        <FormField
          label="Descripción"
          error={errors.descripcion}
        >
          <textarea
            value={form.descripcion || ''}
            onChange={(e) => onChange("descripcion")(e as any)}
            rows={3}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
              errors.descripcion ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Descripción adicional del producto..."
          />
        </FormField>
      </div>

      {/* Información sobre proveedores y fechas */}
      <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start space-x-2">
          <div className="bg-yellow-100 p-1 rounded-full mt-0.5">
            <Truck className="w-4 h-4 text-yellow-600" />
          </div>
          <div className="text-sm text-yellow-800">
            <p className="font-medium">Información de proveedores y vencimiento:</p>
            <p>• Los proveedores se registran en cada movimiento de compra</p>
            <p>• Las fechas de vencimiento se manejan por lote en detalle_contenedor</p>
            <p>• Los precios reales se actualizan con cada compra en movimientos</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierDateSection;
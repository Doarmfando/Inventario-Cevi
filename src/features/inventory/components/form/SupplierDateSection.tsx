import React from "react";
import { Truck, Calendar, Clock } from "lucide-react";
import FormField from "./FormField";
import type { NewProduct } from "../../types";

interface SupplierDateSectionProps {
  form: NewProduct;
  errors: Record<string, string>;
  onChange: (field: keyof NewProduct) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const SupplierDateSection: React.FC<SupplierDateSectionProps> = ({ 
  form, 
  errors, 
  onChange 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Proveedor */}
      <FormField
        label="Proveedor"
        error={errors.supplier}
        icon={Truck}
      >
        <input
          type="text"
          value={form.supplier}
          onChange={onChange("supplier")}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
            errors.supplier ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="Ej: Mercado Pesquero Central"
        />
      </FormField>

      {/* Días estimados para vencimiento */}
      <FormField
        label="Días Estimados para Vencimiento"
        error={errors.estimatedDaysToExpiry}
        required
        icon={Clock}
      >
        <input
          type="number"
          value={form.estimatedDaysToExpiry}
          onChange={onChange("estimatedDaysToExpiry")}
          min="0"
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
            errors.estimatedDaysToExpiry ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="12"
        />
      </FormField>


    </div>
  );
};

export default SupplierDateSection;
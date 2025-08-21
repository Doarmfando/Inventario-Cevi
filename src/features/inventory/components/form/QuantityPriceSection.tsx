// form/QuantityPriceSection.tsx - ACTUALIZADO
import React from "react";
import { Scale, DollarSign } from "lucide-react";
import FormField from "./FormField";
import type { NewProduct, ProductUnit } from "../../types";

interface QuantityPriceSectionProps {
  form: NewProduct;
  errors: Record<string, string>;
  onChange: (field: keyof NewProduct) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const QuantityPriceSection: React.FC<QuantityPriceSectionProps> = ({ 
  form, 
  errors, 
  onChange 
}) => {
  const units: ProductUnit[] = [
    'kg', 'bolsa', 'litro', 'unidad', 'cubeta', 'atado', 'caja'
  ];

  return (
    <>
      {/* Unidad de medida */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Unidad de Medida"
          required
          icon={Scale}
        >
          <select
            value={form.unit}
            onChange={onChange("unit")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            {units.map(unit => (
              <option key={unit} value={unit}>{unit}</option>
            ))}
          </select>
        </FormField>

        {/* Precio unitario */}
        <FormField
          label="Precio (S/)"
          error={errors.price}
          required
          icon={DollarSign}
        >
          <input
            type="number"
            value={form.price}
            onChange={onChange("price")}
            min="0"
            step="0.01"
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
              errors.price ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="0.00"
          />
        </FormField>
      </div>

      {/* Stock mínimo */}
      <div className="grid grid-cols-1 gap-4">
        <FormField
          label="Stock Mínimo"
          error={errors.minStock}
          // Removido required ya que 0 es un valor válido
        >
          <input
            type="number"
            value={form.minStock}
            onChange={onChange("minStock")}
            min="0"
            step="1"
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
              errors.minStock ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="0"
          />
        </FormField>
      </div>
    </>
  );
};

export default QuantityPriceSection;
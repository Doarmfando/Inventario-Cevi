// form/BasicInfoSection.tsx - ACTUALIZADO
import React from "react";
import FormField from "./FormField";
import type { NewProduct, ProductCategory } from "../../types";

interface BasicInfoSectionProps {
  form: NewProduct;
  errors: Record<string, string>;
  onChange: (field: keyof NewProduct) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({ 
  form, 
  errors, 
  onChange 
}) => {
  const categories: ProductCategory[] = [
    'Pescados', 'Mariscos', 'Verduras', 'Condimentos', 'Insumos', 'Suministros'
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        label="Nombre del Producto"
        error={errors.name}
        required
      >
        <input
          type="text"
          value={form.name}
          onChange={onChange("name")}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
            errors.name ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="Ej: Lenguado filetes"
        />
      </FormField>

      <FormField
        label="Categoría"
        required
      >
        <select
          value={form.category}
          onChange={onChange("category")}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </FormField>
    </div>
  );
};

export default BasicInfoSection;
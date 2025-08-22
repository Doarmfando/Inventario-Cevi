// form/BasicInfoSection.tsx - ACTUALIZADO CON CONTAINER
import React from "react";
import { Package } from "lucide-react";
import FormField from "./FormField";
import type { NewProduct, ProductCategory, Container } from "../../types";

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

  const containers: Container[] = [
    'Frigider 1 - Causa',
    'Frigider 2 - Pescado',
    'Frigider 3 - Yuca',
    'Frigider 4 - Mariscos',
    'Congelador 1',
    'Congelador 2',
    'Congelador 3',
    'Congelador 4',
    'Almacén Seco'
  ];

  return (
    <div className="space-y-4">
      {/* Primera fila: Nombre del producto */}
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

      {/* Segunda fila: Categoría y Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        <FormField
          label="Contenedor/Ubicación"
          error={errors.container}
          required
          icon={Package}
        >
          <select
            value={form.container}
            onChange={onChange("container")}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
              errors.container ? 'border-red-300' : 'border-gray-300'
            }`}
          >
            <option value="">Seleccionar contenedor</option>
            {containers.map(container => (
              <option key={container} value={container}>{container}</option>
            ))}
          </select>
        </FormField>
      </div>
    </div>
  );
};

export default BasicInfoSection;
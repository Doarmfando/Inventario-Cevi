// form/SimplifiedBasicInfoSection.tsx - VERSIÓN SUPER SIMPLIFICADA
import React from "react";
import { Package, DollarSign, Scale, AlertTriangle } from "lucide-react";
import FormField from "./FormField";
import type { ProductCategory, Container, ProductUnit } from "../../types";

interface SimplifiedBasicInfoSectionProps {
  form: {
    name: string;
    category: ProductCategory;
    container: string;
    unit: ProductUnit;
    minStock: number;
    price: number;
  };
  errors: Record<string, string>;
  onChange: (field: keyof SimplifiedBasicInfoSectionProps['form']) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const SimplifiedBasicInfoSection: React.FC<SimplifiedBasicInfoSectionProps> = ({ 
  form, 
  errors, 
  onChange 
}) => {
  const categories: ProductCategory[] = [
    'Pescados', 'Mariscos', 'Verduras', 'Condimentos', 'Insumos', 'Suministros'
  ];

  const units: ProductUnit[] = [
    'kg', 'bolsa', 'litro', 'unidad', 'cubeta', 'atado', 'caja'
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
    <div className="space-y-6">
      {/* Nombre del producto */}
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
          autoFocus
        />
      </FormField>

      {/* Categoría, Contenedor y Unidad en una fila */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
      </div>

      {/* Precio Estimado y Stock Mínimo en una fila */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Precio Unitario Estimado (S/)"
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
          <p className="text-xs text-gray-500 mt-1">
            Este precio se usará para estimaciones. El precio real se actualizará con las compras.
          </p>
        </FormField>

        <FormField
          label={`Stock Mínimo (${form.unit})`}
          error={errors.minStock}
          required
          icon={AlertTriangle}
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
          <p className="text-xs text-gray-500 mt-1">
            Cantidad mínima antes de mostrar alerta de stock bajo.
          </p>
        </FormField>
      </div>
    </div>
  );
};

export default SimplifiedBasicInfoSection;
// form/SimplifiedBasicInfoSection.tsx - CON CONTENEDORES RECOMENDADOS
import React from "react";
import { Package, DollarSign, Scale, AlertTriangle, MapPin, CheckSquare } from "lucide-react";
import FormField from "./FormField";
import type { ProductCategory, Container, ProductUnit } from "../../types";
import { CONTAINER_RECOMMENDATIONS } from "../../types";

interface SimplifiedBasicInfoSectionProps {
  form: {
    name: string;
    category: ProductCategory;
    container: string;
    recommendedContainers: Container[];
    unit: ProductUnit;
    minStock: number;
    price: number;
  };
  errors: Record<string, string>;
  onChange: (field: keyof SimplifiedBasicInfoSectionProps['form']) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onRecommendedContainersChange: (containers: Container[]) => void;
}

const SimplifiedBasicInfoSection: React.FC<SimplifiedBasicInfoSectionProps> = ({ 
  form, 
  errors, 
  onChange,
  onRecommendedContainersChange
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

  // Contenedores recomendados por categoría
  const recommendedContainers = CONTAINER_RECOMMENDATIONS[form.category] || [];
  const currentRecommended = form.recommendedContainers || recommendedContainers;

  const handleContainerToggle = (container: Container) => {
    const updated = currentRecommended.includes(container)
      ? currentRecommended.filter(c => c !== container)
      : [...currentRecommended, container];
    
    onRecommendedContainersChange(updated);
  };

  const selectAllRecommended = () => {
    onRecommendedContainersChange(recommendedContainers);
  };

  const clearAll = () => {
    onRecommendedContainersChange([]);
  };

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
          label="Ubicación Principal"
          error={errors.container}
          required
          icon={MapPin}
        >
          <select
            value={form.container}
            onChange={onChange("container")}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
              errors.container ? 'border-red-300' : 'border-gray-300'
            }`}
          >
            <option value="">Seleccionar ubicación principal</option>
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

      {/* Sección: Contenedores Recomendados - COMPACTA */}
      <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-900 flex items-center">
            <Package className="w-4 h-4 mr-2 text-purple-600" />
            Contenedores para Distribución
            <span className="text-xs font-normal text-gray-500 ml-2">(Opcional)</span>
          </h3>
          <div className="space-x-2">
            <button
              type="button"
              onClick={selectAllRecommended}
              className="text-xs text-purple-600 hover:text-purple-700 underline"
            >
              Sugeridos
            </button>
            <button
              type="button"
              onClick={clearAll}
              className="text-xs text-gray-500 hover:text-gray-600 underline"
            >
              Limpiar
            </button>
          </div>
        </div>

        <p className="text-xs text-purple-700 mb-3">
          Basado en "{form.category}", sugerimos: {recommendedContainers.join(', ')}.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {containers.map(container => {
            const isSelected = currentRecommended.includes(container);
            const isRecommended = recommendedContainers.includes(container);
            const isPrimary = form.container === container;
            
            return (
              <div
                key={container}
                className={`relative flex items-center p-2 rounded border cursor-pointer transition-colors text-xs ${
                  isPrimary 
                    ? 'bg-green-100 border-green-300 cursor-not-allowed'
                    : isSelected
                      ? 'bg-purple-100 border-purple-300'
                      : isRecommended
                        ? 'bg-blue-50 border-blue-200 hover:bg-blue-100'
                        : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
                onClick={() => !isPrimary && handleContainerToggle(container)}
              >
                <CheckSquare 
                  className={`w-3 h-3 mr-2 ${
                    isPrimary
                      ? 'text-green-600'
                      : isSelected 
                        ? 'text-purple-600' 
                        : 'text-gray-400'
                  }`}
                  fill={isSelected || isPrimary ? "currentColor" : "none"}
                />
                <span className={`flex-1 ${
                  isPrimary 
                    ? 'text-green-800 font-medium'
                    : isSelected 
                      ? 'text-purple-800' 
                      : 'text-gray-700'
                }`}>
                  {container}
                </span>
                
                {isPrimary && (
                  <span className="text-xs bg-green-600 text-white px-1 py-0.5 rounded">P</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SimplifiedBasicInfoSection;
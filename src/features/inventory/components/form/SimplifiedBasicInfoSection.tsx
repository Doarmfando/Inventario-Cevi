// form/SimplifiedBasicInfoSection.tsx - CORREGIDO CON ESTRUCTURA CORRECTA
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
  // CATEGORÍAS CORREGIDAS - SOLO LAS PERMITIDAS
  const categories: ProductCategory[] = [
    'Pescados',
    'Mariscos',
    'Causa',
    'Tubérculos',
    'Cítricos',
    'Condimentos',
    'Verduras',
    'Bebidas',
    'Bebidas Alcohólicas',
    'Aceites',
    'Granos'
  ];

  // UNIDADES CORREGIDAS - SOLO LAS 7 PERMITIDAS
  const units: ProductUnit[] = [
    'kg',
    'litros',
    'unidades',
    'botellas',
    'rollos',
    'paquetes',
    'atados'
  ];

  // CONTENEDORES CORREGIDOS - 7 CONTENEDORES SEGÚN mockData.ts
  const containers = [
    'Congelador 1 - Pescado',
    'Congelador 2 - Mariscos',
    'Congelador 3 - Causa',
    'Congelador 4 - Verduras',
    'Refrigerador 5 - Gaseosas',
    'Refrigerador 6 - Cervezas',
    'Almacén Seco'
  ] as const;

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

  // Función para mostrar recomendaciones por categoría - CORREGIDA
  const getCategoryRecommendations = (category: ProductCategory): string => {
    const recs = CONTAINER_RECOMMENDATIONS[category] || [];
    return recs.length > 0 ? recs.join(', ') : 'Almacén Seco';
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
          placeholder="Ej: Lenguado filetes, Inca Kola, Aceite vegetal..."
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
          <p className="text-xs text-blue-600 mt-1">
            Sugerido: {getCategoryRecommendations(form.category)}
          </p>
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
          Basado en "{form.category}", sugerimos: {getCategoryRecommendations(form.category)}.
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

        {/* Ayuda contextual por categorías - CORREGIDA SIN CATEGORÍAS INEXISTENTES */}
        <div className="mt-3 pt-3 border-t border-purple-200">
          <div className="text-xs text-purple-600">
            <strong>Ayuda por categoría:</strong>
            <div className="mt-1 space-y-1">
              {form.category === 'Pescados' && <p>• Pescados van principalmente al Congelador 1</p>}
              {form.category === 'Mariscos' && <p>• Mariscos van principalmente al Congelador 2</p>}
              {form.category === 'Causa' && <p>• La Causa preparada va específicamente al Congelador 3</p>}
              {form.category === 'Bebidas' && <p>• Gaseosas van al Refrigerador 5</p>}
              {form.category === 'Bebidas Alcohólicas' && <p>• Cervezas van al Refrigerador 6, vinos al Almacén Seco</p>}
              {form.category === 'Tubérculos' && <p>• Papas para causa → Congelador 3, otros tubérculos → Congelador 4</p>}
              {form.category === 'Cítricos' && <p>• Limones para causa van al Congelador 3</p>}
              {form.category === 'Condimentos' && <p>• Frescos → Congelador 3 o 4, secos → Almacén Seco</p>}
              {form.category === 'Verduras' && <p>• Verduras frescas van al Congelador 4</p>}
              {(form.category === 'Aceites' || form.category === 'Granos') && 
                <p>• Productos no perecederos van al Almacén Seco</p>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimplifiedBasicInfoSection;
// form/SimplifiedBasicInfoSection.tsx - CORREGIDO PARA USAR BD
import React from "react";
import { Package, DollarSign, Scale, AlertTriangle, MapPin, CheckSquare } from "lucide-react";
import FormField from "./FormField";
import type { DBCategoria, DBUnidadMedida, DBContenedor } from "../../types";

interface SimplifiedBasicInfoSectionProps {
  form: {
    nombre: string;
    descripcion: string;
    categoria_id: string;
    unidad_medida_id: string;
    contenedor_fijo_id: string;
    contenedores_recomendados_ids: string[];
    precio_estimado: number;
    stock_min: number;
  };
  errors: Record<string, string>;
  onChange: (field: keyof SimplifiedBasicInfoSectionProps['form']) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onRecommendedContainersChange: (containerIds: string[]) => void;
  // Datos que vienen de la BD
  categories: DBCategoria[];
  units: DBUnidadMedida[];
  containers: DBContenedor[];
}

const SimplifiedBasicInfoSection: React.FC<SimplifiedBasicInfoSectionProps> = ({ 
  form, 
  errors, 
  onChange,
  onRecommendedContainersChange,
  categories,
  units,
  containers
}) => {
  const handleContainerToggle = (containerId: string) => {
    const updated = form.contenedores_recomendados_ids.includes(containerId)
      ? form.contenedores_recomendados_ids.filter(id => id !== containerId)
      : [...form.contenedores_recomendados_ids, containerId];
    
    onRecommendedContainersChange(updated);
  };

  const clearAll = () => {
    onRecommendedContainersChange([]);
  };

  const getSelectedUnit = () => {
    const unit = units.find(u => u.id === form.unidad_medida_id);
    return unit ? unit.abreviatura : 'unidad';
  };

  return (
    <div className="space-y-6">
      {/* Nombre del producto */}
      <FormField
        label="Nombre del Producto"
        error={errors.nombre}
        required
      >
        <input
          type="text"
          value={form.nombre}
          onChange={onChange("nombre")}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
            errors.nombre ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="Ej: Lenguado filetes, Inca Kola, Aceite vegetal..."
          autoFocus
        />
      </FormField>

      {/* Descripción */}
      <FormField
        label="Descripción"
        error={errors.descripcion}
      >
        <input
          type="text"
          value={form.descripcion}
          onChange={onChange("descripcion")}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="Descripción adicional del producto (opcional)"
        />
      </FormField>

      {/* Categoría, Contenedor y Unidad en una fila */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          label="Categoría"
          error={errors.categoria_id}
          required
        >
          <select
            value={form.categoria_id}
            onChange={onChange("categoria_id")}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
              errors.categoria_id ? 'border-red-300' : 'border-gray-300'
            }`}
          >
            <option value="">Seleccionar categoría</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.nombre}
              </option>
            ))}
          </select>
        </FormField>

        <FormField
          label="Ubicación Principal"
          error={errors.contenedor_fijo_id}
          required
          icon={MapPin}
        >
          <select
            value={form.contenedor_fijo_id}
            onChange={onChange("contenedor_fijo_id")}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
              errors.contenedor_fijo_id ? 'border-red-300' : 'border-gray-300'
            }`}
          >
            <option value="">Seleccionar ubicación principal</option>
            {containers.map(container => (
              <option key={container.id} value={container.id}>
                {container.nombre}
              </option>
            ))}
          </select>
        </FormField>

        <FormField
          label="Unidad de Medida"
          error={errors.unidad_medida_id}
          required
          icon={Scale}
        >
          <select
            value={form.unidad_medida_id}
            onChange={onChange("unidad_medida_id")}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
              errors.unidad_medida_id ? 'border-red-300' : 'border-gray-300'
            }`}
          >
            <option value="">Seleccionar unidad</option>
            {units.map(unit => (
              <option key={unit.id} value={unit.id}>
                {unit.nombre} ({unit.abreviatura})
              </option>
            ))}
          </select>
        </FormField>
      </div>

      {/* Precio Estimado y Stock Mínimo en una fila */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <p className="text-xs text-gray-500 mt-1">
            Este precio se usará para estimaciones. El precio real se actualizará con las compras.
          </p>
        </FormField>

        <FormField
          label={`Stock Mínimo (${getSelectedUnit()})`}
          error={errors.stock_min}
          required
          icon={AlertTriangle}
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
          <p className="text-xs text-gray-500 mt-1">
            Cantidad mínima antes de mostrar alerta de stock bajo.
          </p>
        </FormField>
      </div>

      {/* Contenedores para Distribución */}
      <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-900 flex items-center">
            <Package className="w-4 h-4 mr-2 text-purple-600" />
            Contenedores para Distribución
            <span className="text-xs font-normal text-gray-500 ml-2">(Opcional)</span>
          </h3>
          <button
            type="button"
            onClick={clearAll}
            className="text-xs text-gray-500 hover:text-gray-600 underline"
          >
            Limpiar
          </button>
        </div>

        <p className="text-xs text-purple-700 mb-3">
          Selecciona contenedores adicionales donde este producto podría almacenarse.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {containers.map(container => {
            const isSelected = form.contenedores_recomendados_ids.includes(container.id);
            const isPrimary = form.contenedor_fijo_id === container.id;
            
            return (
              <div
                key={container.id}
                className={`relative flex items-center p-2 rounded border cursor-pointer transition-colors text-xs ${
                  isPrimary 
                    ? 'bg-green-100 border-green-300 cursor-not-allowed'
                    : isSelected
                      ? 'bg-purple-100 border-purple-300'
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
                onClick={() => !isPrimary && handleContainerToggle(container.id)}
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
                  {container.nombre}
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
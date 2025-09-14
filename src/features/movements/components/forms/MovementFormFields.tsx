// src/features/movements/components/forms/MovementFormFields.tsx
// ACTUALIZADO CON CAMPO EMPAQUETADO

import React, { useEffect, useRef } from 'react';
import { Package, MapPin, Scale, Layers } from 'lucide-react';
import type { MovementFormData, AvailableProduct, MotivoMovimiento } from '../../types/movement.types';
import { movementTypes } from '../../constants/formConstants';
import { MovementsService } from '../../services/movementsService';

interface MovementFormFieldsProps {
  formData: MovementFormData;
  errors: Record<string, string>;
  selectedProduct: AvailableProduct | undefined;
  availableProducts: AvailableProduct[];
  containers: Array<{id: string; nombre: string}>;
  onInputChange: (field: keyof MovementFormData, value: any) => void;
}

const MovementFormFields: React.FC<MovementFormFieldsProps> = ({
  formData,
  errors,
  selectedProduct,
  availableProducts,
  containers,
  onInputChange
}) => {
  const previousProductId = useRef<string | null>(null);
  const [motivosDelTipo, setMotivosDelTipo] = React.useState<MotivoMovimiento[]>([]);

  // Cargar motivos cuando cambia el tipo de movimiento
  useEffect(() => {
    const cargarMotivos = async () => {
      try {
        const motivos = await MovementsService.getMotivosMovimiento(formData.tipo_movimiento);
        setMotivosDelTipo(motivos);
        
        if (motivos.length > 0 && !formData.motivo_movimiento_id) {
          onInputChange('motivo_movimiento_id', motivos[0].id);
        }
      } catch (error) {
        console.error('Error cargando motivos:', error);
      }
    };

    cargarMotivos();
  }, [formData.tipo_movimiento, onInputChange]);

  // Obtener contenedores recomendados para el producto seleccionado
  const contenedoresRecomendados = selectedProduct?.contenedores_recomendados || [];
  const contenedorFijo = selectedProduct?.contenedor_fijo;

  // Auto-seleccionar contenedor por defecto SOLO cuando cambie de producto
  useEffect(() => {
    if (selectedProduct && selectedProduct.id !== previousProductId.current) {
      let defaultContainer = '';
      
      if (contenedorFijo) {
        defaultContainer = contenedorFijo.id;
      } else if (contenedoresRecomendados.length > 0) {
        defaultContainer = contenedoresRecomendados[0].id;
      }
      
      if (defaultContainer) {
        onInputChange('contenedor_id', defaultContainer);
      }
      
      previousProductId.current = selectedProduct.id;
    }
  }, [selectedProduct, contenedorFijo, contenedoresRecomendados, onInputChange]);

  return (
    <div className="space-y-6">
      {/* Tipo de Movimiento */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Tipo de Movimiento
        </label>
        <div className="grid grid-cols-3 gap-3">
          {movementTypes.map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.value}
                type="button"
                onClick={() => onInputChange('tipo_movimiento', type.value)}
                className={`flex flex-col items-center p-4 border-2 rounded-lg transition-all ${
                  formData.tipo_movimiento === type.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Icon className={`w-6 h-6 mb-2 ${type.color}`} />
                <span className="text-sm font-medium">{type.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Motivo y Precio Unitario */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="motivo" className="block text-sm font-medium text-gray-700 mb-2">
            Motivo
          </label>
          <select
            id="motivo"
            value={formData.motivo_movimiento_id}
            onChange={(e) => onInputChange('motivo_movimiento_id', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.motivo_movimiento_id ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Selecciona un motivo...</option>
            {motivosDelTipo.map((motivo) => (
              <option key={motivo.id} value={motivo.id}>
                {motivo.nombre}
              </option>
            ))}
          </select>
          {errors.motivo_movimiento_id && (
            <p className="mt-1 text-sm text-red-600">{errors.motivo_movimiento_id}</p>
          )}
        </div>

        <div>
          <label htmlFor="precioReal" className="block text-sm font-medium text-gray-700 mb-2">
            Precio Real
            {selectedProduct && (
              <span className="text-xs text-gray-500 ml-1">
                (Estimado: S/ {selectedProduct.precio_estimado.toFixed(2)})
              </span>
            )}
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              S/
            </span>
            <input
              type="number"
              id="precioReal"
              min="0"
              step="0.01"
              value={formData.precio_real || ''}
              onChange={(e) => {
                const value = e.target.value === '' ? undefined : parseFloat(e.target.value);
                onInputChange('precio_real', isNaN(value as number) ? undefined : value);
              }}
              className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0.00"
            />
          </div>
          {errors.precio_real && (
            <p className="mt-1 text-sm text-red-600">{errors.precio_real}</p>
          )}
        </div>
      </div>

      {/* Producto y Contenedor */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="producto" className="block text-sm font-medium text-gray-700 mb-2">
            Selecciona el Producto
          </label>
          <select
            id="producto"
            value={formData.producto_id}
            onChange={(e) => onInputChange('producto_id', e.target.value)}
            className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.producto_id ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Selecciona un producto...</option>
            {availableProducts.map((product) => (
              <option key={product.id} value={product.id}>
                {product.nombre} - Stock: {product.stock_actual} {product.unidad_medida} - Empaquetados: {product.total_empaquetados}
              </option>
            ))}
          </select>
          {errors.producto_id && (
            <p className="mt-1 text-sm text-red-600">{errors.producto_id}</p>
          )}
        </div>
        
        <div>
          <label
            htmlFor="contenedor"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Contenedor de Destino
            {contenedorFijo && (
              <span className="text-xs text-gray-500 ml-2">
                (Actual: {contenedorFijo.nombre})
              </span>
            )}
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              id="contenedor"
              value={formData.contenedor_id}
              onChange={(e) => onInputChange("contenedor_id", e.target.value)}
              className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.contenedor_id ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Selecciona un contenedor...</option>

              {contenedorFijo && (
                <optgroup label="Contenedor actual">
                  <option key={contenedorFijo.id} value={contenedorFijo.id}>
                    {contenedorFijo.nombre} (Actual)
                  </option>
                </optgroup>
              )}

              {contenedoresRecomendados.length > 0 && (
                <optgroup label="Recomendados para este producto">
                  {contenedoresRecomendados
                    .filter(cont => cont.id !== contenedorFijo?.id)
                    .map((contenedor) => (
                      <option key={contenedor.id} value={contenedor.id}>
                        {contenedor.nombre}
                      </option>
                    ))}
                </optgroup>
              )}

              {containers.length > 0 && (
                <optgroup label="Todos los contenedores">
                  {containers
                    .filter(cont => 
                      cont.id !== contenedorFijo?.id && 
                      !contenedoresRecomendados.some(rec => rec.id === cont.id)
                    )
                    .map((contenedor) => (
                      <option key={contenedor.id} value={contenedor.id}>
                        {contenedor.nombre}
                      </option>
                    ))}
                </optgroup>
              )}
            </select>
          </div>
          {errors.contenedor_id && (
            <p className="mt-1 text-sm text-red-600">{errors.contenedor_id}</p>
          )}
        </div>
      </div>

      {/* Información del Producto Seleccionado */}
      {selectedProduct && (
        <div className="bg-gray-50 p-4 rounded-lg border">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <Package className="w-4 h-4 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">Producto</p>
                <p className="font-medium text-gray-900">{selectedProduct.nombre}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">Ubicación Actual</p>
                <p className="font-medium text-gray-900">
                  {selectedProduct.contenedor_fijo?.nombre || 'Sin contenedor fijo'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Scale className="w-4 h-4 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">Stock Actual</p>
                <p className="font-medium text-gray-900">{selectedProduct.stock_actual} {selectedProduct.unidad_medida}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Layers className="w-4 h-4 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">Empaquetados</p>
                <p className="font-medium text-gray-900">{selectedProduct.total_empaquetados}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cantidad y Empaquetado - NUEVA SECCIÓN */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Cantidad */}
        <div>
          <label htmlFor="cantidad" className="block text-sm font-medium text-gray-700 mb-2">
            Cantidad Total {selectedProduct && `(${selectedProduct.unidad_medida})`}
          </label>
          <input
            type="number"
            id="cantidad"
            min="0"
            step="0.1"
            value={formData.cantidad === 0 ? '' : formData.cantidad}
            onChange={(e) => {
              const value = e.target.value === '' ? 0 : parseFloat(e.target.value);
              onInputChange('cantidad', isNaN(value) ? 0 : value);
            }}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.cantidad ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Ingresa la cantidad total"
          />
          {errors.cantidad && (
            <p className="mt-1 text-sm text-red-600">{errors.cantidad}</p>
          )}
        </div>

        {/* Empaquetado - NUEVO CAMPO */}
        <div>
          <label htmlFor="empaquetado" className="block text-sm font-medium text-gray-700 mb-2">
            Empaquetado / Raciones
            <span className="text-xs text-gray-500 ml-1">(Opcional)</span>
          </label>
          <div className="relative">
            <Layers className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              id="empaquetado"
              value={formData.empaquetado || ''}
              onChange={(e) => onInputChange('empaquetado', e.target.value)}
              className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.empaquetado ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ej: 5 bolsas x 1kg, 10 porciones, etc."
              maxLength={100}
            />
          </div>
          {errors.empaquetado && (
            <p className="mt-1 text-sm text-red-600">{errors.empaquetado}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Describe cómo viene dividido el producto (porciones, bolsas, paquetes, etc.)
          </p>
        </div>
      </div>

      {/* Número de Documento */}
      <div>
        <label htmlFor="documento" className="block text-sm font-medium text-gray-700 mb-2">
          Número de Documento (Opcional)
        </label>
        <input
          type="text"
          id="documento"
          value={formData.numero_documento || ''}
          onChange={(e) => onInputChange('numero_documento', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Ej: FAC-001-2024, BOL-001-0156"
        />
      </div>

      {/* Observaciones */}
      <div>
        <label htmlFor="observaciones" className="block text-sm font-medium text-gray-700 mb-2">
          Observaciones (Opcional)
        </label>
        <textarea
          id="observaciones"
          rows={3}
          value={formData.observacion || ''}
          onChange={(e) => onInputChange('observacion', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          placeholder="Describe detalles adicionales del movimiento..."
        />
      </div>
    </div>
  );
};

export default MovementFormFields;
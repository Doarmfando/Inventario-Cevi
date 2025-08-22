// form/QuantityPriceSection.tsx - ACTUALIZADO CON STOCK Y EMPAQUETADO
import React from "react";
import { Scale, DollarSign, Package2, BarChart3 } from "lucide-react";
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
    <div className="space-y-6">
      {/* Sección: Información de Stock */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
          Información de Stock
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Unidad de medida */}
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

          {/* Cantidad inicial */}
          <FormField
            label="Cantidad Inicial"
            error={errors.quantity}
            required
          >
            <input
              type="number"
              value={form.quantity}
              onChange={onChange("quantity")}
              min="0"
              step="0.1"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                errors.quantity ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="0"
            />
          </FormField>

          {/* Stock mínimo */}
          <FormField
            label="Stock Mínimo"
            error={errors.minStock}
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
      </div>

      {/* Sección: Precio */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <DollarSign className="w-5 h-5 mr-2 text-green-600" />
          Información de Precio
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
          <FormField
            label="Precio Unitario (S/)"
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
      </div>

      {/* Sección: Empaquetado (Opcional) */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <Package2 className="w-5 h-5 mr-2 text-purple-600" />
          Empaquetado Gastronómico
          <span className="text-sm font-normal text-gray-500 ml-2">(Opcional)</span>
        </h3>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600 mb-4">
            Si ya tienes productos empaquetados listos para servir, completa esta sección.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Número de empaquetados */}
            <FormField
              label="# de Empaquetados"
              error={errors.packagedUnits}
            >
              <input
                type="number"
                value={form.packagedUnits || 0}
                onChange={onChange("packagedUnits")}
                min="0"
                step="1"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.packagedUnits ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="0"
              />
            </FormField>

            {/* Peso por empaquetado */}
            <FormField
              label={`Peso por Empaquetado (${form.unit})`}
              error={errors.weightPerPackage}
            >
              <input
                type="number"
                value={form.weightPerPackage || 1}
                onChange={onChange("weightPerPackage")}
                min="0.1"
                step="0.1"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.weightPerPackage ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="1"
              />
            </FormField>

            {/* Días de vencimiento empaquetados */}
            <FormField
              label="Días Vencimiento Empaquetados"
              error={errors.packagedExpiryDays}
            >
              <input
                type="number"
                value={form.packagedExpiryDays || form.estimatedDaysToExpiry}
                onChange={onChange("packagedExpiryDays")}
                min="0"
                step="1"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.packagedExpiryDays ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder={form.estimatedDaysToExpiry.toString()}
              />
            </FormField>
          </div>

          {/* Información calculada */}
          {form.packagedUnits && form.packagedUnits > 0 && (
            <div className="mt-3 p-3 bg-blue-50 rounded border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>Total empaquetado:</strong> {((form.packagedUnits || 0) * (form.weightPerPackage || 1)).toFixed(1)} {form.unit}
              </p>
              <p className="text-sm text-blue-700">
                <strong>Stock disponible:</strong> {Math.max(0, form.quantity - ((form.packagedUnits || 0) * (form.weightPerPackage || 1))).toFixed(1)} {form.unit}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuantityPriceSection;
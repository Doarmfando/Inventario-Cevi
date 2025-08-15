import React, { useState } from "react";
import { X, Package, Scale, DollarSign, Calendar, Refrigerator } from "lucide-react";
import type { NewProduct, ProductCategory, ProductUnit, Container } from "../types";

interface Props {
  onSubmit: (product: NewProduct) => void;
  onClose: () => void;
}

const ProductForm: React.FC<Props> = ({ onSubmit, onClose }) => {
  const [form, setForm] = useState<NewProduct>({
    name: "",
    category: "Pescados",
    quantity: 0,
    unit: "kg",
    price: 0,
    minStock: 0,
    supplier: "",
    expiryDate: "",
    container: "Frigider 2 - Pescado",
    state: "fresco"
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

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

  const handleChange = (field: keyof NewProduct) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = field === "quantity" || field === "price" || field === "minStock" 
      ? Number(e.target.value) 
      : e.target.value;
    
    setForm(prev => ({ ...prev, [field]: value }));
    
    // Limpiar error del campo
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!form.name.trim()) newErrors.name = "El nombre es requerido";
    if (form.quantity <= 0) newErrors.quantity = "La cantidad debe ser mayor a 0";
    if (form.price <= 0) newErrors.price = "El precio debe ser mayor a 0";
    if (form.minStock < 0) newErrors.minStock = "El stock mínimo no puede ser negativo";
    if (!form.supplier.trim()) newErrors.supplier = "El proveedor es requerido";
    if (!form.expiryDate) newErrors.expiryDate = "La fecha de vencimiento es requerida";

    // Validar que la fecha de vencimiento sea futura
    const today = new Date().toISOString().split('T')[0];
    if (form.expiryDate && form.expiryDate <= today) {
      newErrors.expiryDate = "La fecha de vencimiento debe ser futura";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(form);
    }
  };

  // Obtener fecha mínima (mañana)
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <Package className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Agregar Producto</h2>
              <p className="text-sm text-gray-500">Complete la información del nuevo producto</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Información básica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Producto *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={handleChange("name")}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Ej: Lenguado filetes"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoría *
              </label>
              <select
                value={form.category}
                onChange={handleChange("category")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Cantidad y unidad */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Scale className="w-4 h-4 inline mr-1" />
                Cantidad *
              </label>
              <input
                type="number"
                value={form.quantity}
                onChange={handleChange("quantity")}
                min="0"
                step="0.01"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.quantity ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="0"
              />
              {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unidad de Medida *
              </label>
              <select
                value={form.unit}
                onChange={handleChange("unit")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {units.map(unit => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Precio y stock mínimo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="w-4 h-4 inline mr-1" />
                Precio Unitario (S/) *
              </label>
              <input
                type="number"
                value={form.price}
                onChange={handleChange("price")}
                min="0"
                step="0.01"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.price ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="0.00"
              />
              {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock Mínimo *
              </label>
              <input
                type="number"
                value={form.minStock}
                onChange={handleChange("minStock")}
                min="0"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.minStock ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="0"
              />
              {errors.minStock && <p className="text-red-500 text-xs mt-1">{errors.minStock}</p>}
            </div>
          </div>

          {/* Proveedor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Proveedor *
            </label>
            <input
              type="text"
              value={form.supplier}
              onChange={handleChange("supplier")}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                errors.supplier ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Ej: Mercado Pesquero Central"
            />
            {errors.supplier && <p className="text-red-500 text-xs mt-1">{errors.supplier}</p>}
          </div>

          {/* Fecha de vencimiento y contenedor */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Fecha de Vencimiento *
              </label>
              <input
                type="date"
                value={form.expiryDate}
                onChange={handleChange("expiryDate")}
                min={getMinDate()}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.expiryDate ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.expiryDate && <p className="text-red-500 text-xs mt-1">{errors.expiryDate}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Refrigerator className="w-4 h-4 inline mr-1" />
                Contenedor *
              </label>
              <select
                value={form.container}
                onChange={handleChange("container")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {containers.map(container => (
                  <option key={container} value={container}>{container}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Estado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado Inicial *
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="fresco"
                  checked={form.state === "fresco"}
                  onChange={handleChange("state")}
                  className="mr-2 text-green-600 focus:ring-green-500"
                />
                <span className="text-sm text-gray-700">Fresco</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="congelado"
                  checked={form.state === "congelado"}
                  onChange={handleChange("state")}
                  className="mr-2 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Congelado</span>
              </label>
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <Package className="w-4 h-4" />
              <span>Agregar Producto</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
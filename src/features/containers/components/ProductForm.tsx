// src/features/containers/components/ProductForm.tsx

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Package, 
  Search, 
  Plus, 
  Calendar, 
  DollarSign,
  Hash,
  Scale,
  Tag,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import type { ProductFormData, Container } from '../types/container.types';
import type { InventoryProduct } from '../data/mockProductData';
import { 
  getRecommendedProducts, 
  searchProducts, 
  getCategories 
} from '../data/mockProductData';

interface ProductFormProps {
  container: Container;
  onSubmit: (data: ProductFormData) => void;
  onClose: () => void;
  onCreateNewProduct?: (productData: Partial<InventoryProduct>) => void;
}

interface NewProductData {
  name: string;
  category: string;
  basePrice: number;
  unit: string;
  description: string;
  isPerishable: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({
  container,
  onSubmit,
  onClose,
  onCreateNewProduct
}) => {
  const [selectedProduct, setSelectedProduct] = useState<InventoryProduct | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateProduct, setShowCreateProduct] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState<InventoryProduct[]>([]);
  const [categories] = useState<string[]>(getCategories());
  
  const [formData, setFormData] = useState<ProductFormData>({
    productId: '',
    containerId: container.id,
    totalQuantity: 0,
    packagedUnits: 1,
    expiryDate: '',
    state: 'fresco',
    price: 0,
  });

  const [newProductData, setNewProductData] = useState<NewProductData>({
    name: '',
    category: '',
    basePrice: 0,
    unit: 'kg',
    description: '',
    isPerishable: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [step, setStep] = useState<'select' | 'configure'>('select');

  // Inicializar productos filtrados
  useEffect(() => {
    const recommended = getRecommendedProducts(container.type);
    setFilteredProducts(recommended);
  }, [container.type]);

  // Filtrar productos por búsqueda
  useEffect(() => {
    if (searchTerm.trim()) {
      const searched = searchProducts(searchTerm);
      setFilteredProducts(searched);
    } else {
      const recommended = getRecommendedProducts(container.type);
      setFilteredProducts(recommended);
    }
  }, [searchTerm, container.type]);

  const handleProductSelect = (product: InventoryProduct) => {
    setSelectedProduct(product);
    setFormData(prev => ({
      ...prev,
      productId: product.id,
      price: product.basePrice,
      state: determineInitialState(product, container.type)
    }));
    setStep('configure');
  };

  const determineInitialState = (product: InventoryProduct, containerType: string) => {
    if (containerType === 'congelador') return 'congelado';
    if (product.isPerishable) return 'fresco';
    return 'fresco';
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (showCreateProduct) {
      const processedValue = ['basePrice'].includes(name) && value !== '' 
        ? parseFloat(value) 
        : name === 'isPerishable' ? value === 'true' : value;
      
      setNewProductData(prev => ({
        ...prev,
        [name]: processedValue
      }));
    } else {
      const processedValue = ['totalQuantity', 'packagedUnits', 'price'].includes(name) && value !== '' 
        ? parseFloat(value) 
        : value;
      
      setFormData(prev => ({
        ...prev,
        [name]: processedValue
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const calculateQuantityPerPackage = () => {
    if (formData.packagedUnits > 0 && formData.totalQuantity > 0) {
      return (formData.totalQuantity / formData.packagedUnits).toFixed(2);
    }
    return '0';
  };

  const validateProductForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.productId) {
      newErrors.productId = 'Debe seleccionar un producto';
    }

    if (!formData.totalQuantity || formData.totalQuantity <= 0) {
      newErrors.totalQuantity = 'La cantidad total debe ser mayor a 0';
    }

    if (!formData.packagedUnits || formData.packagedUnits <= 0) {
      newErrors.packagedUnits = 'Debe haber al menos 1 empaquetado';
    }

    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'El precio debe ser mayor a 0';
    }

    if (selectedProduct?.isPerishable && !formData.expiryDate) {
      newErrors.expiryDate = 'La fecha de vencimiento es requerida para productos perecederos';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateNewProduct = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!newProductData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!newProductData.category.trim()) {
      newErrors.category = 'La categoría es requerida';
    }

    if (!newProductData.basePrice || newProductData.basePrice <= 0) {
      newErrors.basePrice = 'El precio base debe ser mayor a 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (showCreateProduct) {
      if (validateNewProduct() && onCreateNewProduct) {
        onCreateNewProduct({
          ...newProductData,
          recommendedContainerTypes: [container.type],
          createdAt: new Date(),
        });
        setShowCreateProduct(false);
        // Reset form
        setNewProductData({
          name: '',
          category: '',
          basePrice: 0,
          unit: 'kg',
          description: '',
          isPerishable: true,
        });
      }
    } else {
      if (validateProductForm()) {
        onSubmit(formData);
      }
    }
  };

  const handleBack = () => {
    if (step === 'configure') {
      setStep('select');
      setSelectedProduct(null);
      setFormData(prev => ({
        ...prev,
        productId: '',
        price: 0,
      }));
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-lg bg-white mb-10">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {showCreateProduct ? 'Crear Nuevo Producto' : 'Agregar Producto al Contenedor'}
              </h3>
              <p className="text-sm text-gray-500">
                {showCreateProduct 
                  ? 'Crea un nuevo producto para el inventario'
                  : `${container.name} - ${step === 'select' ? 'Selecciona el producto' : 'Configura las cantidades'}`
                }
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Form Content */}
        <div className="mt-6">
          {showCreateProduct ? (
            /* Create New Product Form */
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre del Producto *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={newProductData.name}
                    onChange={handleInputChange}
                    placeholder="Ej: Salmón Fresco"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoría *
                  </label>
                  <select
                    name="category"
                    value={newProductData.category}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.category ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Seleccionar categoría</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                    <option value="nueva">Nueva categoría (escribir abajo)</option>
                  </select>
                  {newProductData.category === 'nueva' && (
                    <input
                      type="text"
                      name="category"
                      value=""
                      onChange={handleInputChange}
                      placeholder="Escribir nueva categoría"
                      className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  )}
                  {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Precio Base *
                  </label>
                  <div className="relative">
                    <DollarSign className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="number"
                      name="basePrice"
                      value={newProductData.basePrice || ''}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.basePrice ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {errors.basePrice && <p className="mt-1 text-sm text-red-600">{errors.basePrice}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unidad de Medida
                  </label>
                  <select
                    name="unit"
                    value={newProductData.unit}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="kg">Kilogramos (kg)</option>
                    <option value="litros">Litros</option>
                    <option value="unidades">Unidades</option>
                    <option value="cajas">Cajas</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ¿Es Perecedero?
                  </label>
                  <select
                    name="isPerishable"
                    value={newProductData.isPerishable.toString()}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="true">Sí, es perecedero</option>
                    <option value="false">No, no es perecedero</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción
                  </label>
                  <textarea
                    name="description"
                    value={newProductData.description}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Descripción del producto..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowCreateProduct(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-lg hover:bg-green-700 transition-colors"
                >
                  Crear Producto
                </button>
              </div>
            </form>
          ) : (
            /* Add Product Form */
            <>
              {step === 'select' && (
                <div className="space-y-6">
                  {/* Search */}
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar productos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* Create New Product Button */}
                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={() => setShowCreateProduct(true)}
                      className="inline-flex items-center space-x-2 text-green-600 hover:text-green-700 hover:bg-green-50 px-4 py-2 rounded-lg transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Crear Nuevo Producto</span>
                    </button>
                  </div>

                  {/* Product Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                    {filteredProducts.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => handleProductSelect(product)}
                        className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{product.name}</h4>
                            <p className="text-sm text-gray-500">{product.category}</p>
                            <p className="text-sm font-medium text-green-600 mt-1">
                              S/ {product.basePrice.toFixed(2)} / {product.unit}
                            </p>
                            {product.isPerishable && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 mt-2">
                                Perecedero
                              </span>
                            )}
                          </div>
                          <Package className="w-5 h-5 text-gray-400" />
                        </div>
                      </div>
                    ))}
                  </div>

                  {filteredProducts.length === 0 && (
                    <div className="text-center py-8">
                      <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No se encontraron productos
                      </h3>
                      <p className="text-gray-600">
                        {searchTerm ? 'Intenta con otros términos de búsqueda' : 'No hay productos recomendados para este tipo de contenedor'}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {step === 'configure' && selectedProduct && (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Selected Product Info */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-blue-900">{selectedProduct.name}</h4>
                        <p className="text-sm text-blue-700">{selectedProduct.category}</p>
                        <p className="text-sm font-medium text-blue-800">
                          S/ {selectedProduct.basePrice.toFixed(2)} / {selectedProduct.unit}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleBack}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        Cambiar producto
                      </button>
                    </div>
                  </div>

                  {/* Configuration Form */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Scale className="w-4 h-4 inline mr-1" />
                        Cantidad Total *
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          name="totalQuantity"
                          value={formData.totalQuantity || ''}
                          onChange={handleInputChange}
                          placeholder="0"
                          step="0.01"
                          min="0"
                          className={`w-full px-3 py-2 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors.totalQuantity ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                          {selectedProduct.unit}
                        </span>
                      </div>
                      {errors.totalQuantity && <p className="mt-1 text-sm text-red-600">{errors.totalQuantity}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Hash className="w-4 h-4 inline mr-1" />
                        Número de Empaquetados *
                      </label>
                      <input
                        type="number"
                        name="packagedUnits"
                        value={formData.packagedUnits || ''}
                        onChange={handleInputChange}
                        placeholder="1"
                        min="1"
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.packagedUnits ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.packagedUnits && <p className="mt-1 text-sm text-red-600">{errors.packagedUnits}</p>}
                      
                      {/* Auto-calculated quantity per package */}
                      {formData.totalQuantity > 0 && formData.packagedUnits > 0 && (
                        <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-sm">
                          <CheckCircle className="w-4 h-4 inline text-green-600 mr-1" />
                          <span className="text-green-800">
                            Cada empaquetado tendrá: <strong>{calculateQuantityPerPackage()} {selectedProduct.unit}</strong>
                          </span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <DollarSign className="w-4 h-4 inline mr-1" />
                        Precio por {selectedProduct.unit} *
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price || ''}
                        onChange={handleInputChange}
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.price ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
                      
                      {/* Total value calculation */}
                      {formData.totalQuantity > 0 && formData.price > 0 && (
                        <p className="mt-1 text-sm text-gray-600">
                          Valor total: <strong>S/ {(formData.totalQuantity * formData.price).toFixed(2)}</strong>
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Tag className="w-4 h-4 inline mr-1" />
                        Estado Inicial
                      </label>
                      <select
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="fresco">Fresco</option>
                        <option value="congelado">Congelado</option>
                        <option value="por-vencer">Por vencer</option>
                      </select>
                    </div>

                    {selectedProduct.isPerishable && (
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Calendar className="w-4 h-4 inline mr-1" />
                          Fecha de Vencimiento *
                        </label>
                        <input
                          type="date"
                          name="expiryDate"
                          value={formData.expiryDate}
                          onChange={handleInputChange}
                          min={new Date().toISOString().split('T')[0]}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors.expiryDate ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {errors.expiryDate && <p className="mt-1 text-sm text-red-600">{errors.expiryDate}</p>}
                        
                        <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                          <div className="flex items-start">
                            <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 mr-2 flex-shrink-0" />
                            <div className="text-sm text-amber-800">
                              <p className="font-medium mb-1">Estados automáticos por vencimiento:</p>
                              <ul className="text-xs space-y-0.5">
                                <li>• <strong>Fresco:</strong> 15+ días para vencer</li>
                                <li>• <strong>Por vencer:</strong> 10-15 días para vencer</li>
                                <li>• <strong>Vencido:</strong> fecha pasada</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Summary Box */}
                  {formData.totalQuantity > 0 && formData.packagedUnits > 0 && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3">Resumen del ingreso:</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Producto:</span>
                          <p className="font-medium">{selectedProduct.name}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Cantidad total:</span>
                          <p className="font-medium">{formData.totalQuantity} {selectedProduct.unit}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Empaquetados:</span>
                          <p className="font-medium">{formData.packagedUnits} unidades</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Valor total:</span>
                          <p className="font-medium text-green-600">S/ {(formData.totalQuantity * formData.price).toFixed(2)}</p>
                        </div>
                      </div>
                      
                      <div className="mt-3 p-2 bg-blue-50 rounded border-l-4 border-blue-400">
                        <p className="text-sm text-blue-800">
                          Se crearán <strong>{formData.packagedUnits} registros</strong> en la tabla, 
                          cada uno con <strong>{calculateQuantityPerPackage()} {selectedProduct.unit}</strong>
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between space-x-3 pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      ← Volver
                    </button>
                    
                    <div className="flex space-x-3">
                      <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Agregar al Contenedor
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
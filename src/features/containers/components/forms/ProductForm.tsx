// src/features/containers/components/forms/ProductForm.tsx

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Package, 
  Search, 
  Plus, 
  Calendar, 
  DollarSign,
  Scale,
  Star,
  Archive,
  Thermometer
} from 'lucide-react';
import type { ContainerWithDetails, ProductToContainerFormData } from '../../types/container.types';
import { useProducts } from '../../hooks/useProducts';
import { useInventoryProducts } from '../../hooks/useInventoryProducts';

interface ProductFormProps {
  container: ContainerWithDetails;
  onSubmit: (data: ProductToContainerFormData) => void;
  onClose: () => void;
}

interface ProductOption {
  id: string;
  nombre: string;
  categoria: string;
  precio_base: number;
  unidad_medida: string;
  isFromInventory?: boolean;
}

// Componente FormField reutilizable
interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  icon?: typeof Package;
  children: React.ReactNode;
}

const FormField: React.FC<FormFieldProps> = ({ 
  label, 
  error, 
  required = false, 
  icon: Icon,
  children 
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {Icon && <Icon className="w-4 h-4 inline mr-1" />}
        {label} {required && "*"}
      </label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

// Componente para mostrar productos por sección
interface ProductSectionProps {
  title: string;
  products: ProductOption[];
  icon: typeof Archive;
  onProductSelect: (product: ProductOption) => void;
  badge?: string;
}

const ProductSection: React.FC<ProductSectionProps> = ({
  title,
  products,
  icon: Icon,
  onProductSelect,
  badge
}) => {
  if (products.length === 0) return null;

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-5 h-5 text-blue-600" />
        <h4 className="font-medium text-gray-900">{title}</h4>
        {badge && (
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
            {badge}
          </span>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            onClick={() => onProductSelect(product)}
            className={`border rounded-lg p-4 cursor-pointer transition-colors ${
              product.isFromInventory 
                ? 'border-green-200 hover:border-green-500 hover:bg-green-50 bg-green-25' 
                : 'border-gray-200 hover:border-blue-500 hover:bg-blue-50'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h5 className="font-medium text-gray-900">{product.nombre}</h5>
                  {product.isFromInventory && (
                    <Star className="w-4 h-4 text-green-600 fill-current" />
                  )}
                </div>
                <p className="text-sm text-gray-500">{product.categoria}</p>
                <p className="text-sm font-medium text-green-600 mt-1">
                  S/ {product.precio_base.toFixed(2)} / {product.unidad_medida}
                </p>
              </div>
              <Package className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ProductForm: React.FC<ProductFormProps> = ({
  container,
  onSubmit,
  onClose,
}) => {
  const { inventoryProducts, recommendedProducts, loading } = useProducts();
  const { 
    categories, 
    units, 
    productStates,
    createProduct: createInventoryProduct,
    addProductToContainer 
  } = useInventoryProducts();
  
  const [selectedProduct, setSelectedProduct] = useState<ProductOption | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateProduct, setShowCreateProduct] = useState(false);
  const [filteredInventoryProducts, setFilteredInventoryProducts] = useState<ProductOption[]>([]);
  const [filteredRecommendedProducts, setFilteredRecommendedProducts] = useState<ProductOption[]>([]);
  
  const [formData, setFormData] = useState<ProductToContainerFormData>({
    producto_id: '',
    contenedor_id: container.id,
    cantidad: 0,
    empaquetado: '1 unidad',
    fecha_vencimiento: '',
    estado_producto_id: '',
    precio_real_unidad: 0,
  });

  const [newProductData, setNewProductData] = useState({
    nombre: '',
    categoria_id: '',
    precio_estimado: 0,
    unidad_medida_id: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [step, setStep] = useState<'select' | 'configure'>('select');

  // Filtrar productos por búsqueda
  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = (products: ProductOption[]) => 
        products.filter(product =>
          product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.categoria.toLowerCase().includes(searchTerm.toLowerCase())
        );
      
      setFilteredInventoryProducts(filtered(inventoryProducts));
      setFilteredRecommendedProducts(filtered(recommendedProducts));
    } else {
      setFilteredInventoryProducts(inventoryProducts);
      setFilteredRecommendedProducts(recommendedProducts);
    }
  }, [searchTerm, inventoryProducts, recommendedProducts]);

  const handleProductSelect = (product: ProductOption) => {
    setSelectedProduct(product);
    setFormData(prev => ({
      ...prev,
      producto_id: product.id,
      precio_real_unidad: product.precio_base,
    }));
    setStep('configure');
  };

  const handleInputChange = (field: string) => 
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { value } = e.target;
      
      if (showCreateProduct) {
        const processedValue = field === 'precio_estimado' && value !== '' 
          ? parseFloat(value) 
          : value;
        
        setNewProductData(prev => ({
          ...prev,
          [field]: processedValue
        }));
      } else {
        const processedValue = ['cantidad', 'precio_real_unidad'].includes(field) && value !== '' 
          ? parseFloat(value) 
          : value;
        
        setFormData(prev => ({
          ...prev,
          [field]: processedValue
        }));
      }

      // Clear error when user starts typing
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: '' }));
      }
    };

  const validateProductForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.producto_id) {
      newErrors.producto_id = 'Debe seleccionar un producto';
    }

    if (!formData.cantidad || formData.cantidad <= 0) {
      newErrors.cantidad = 'La cantidad debe ser mayor a 0';
    }

    if (!formData.precio_real_unidad || formData.precio_real_unidad <= 0) {
      newErrors.precio_real_unidad = 'El precio debe ser mayor a 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateNewProduct = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!newProductData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    if (!newProductData.categoria_id) {
      newErrors.categoria_id = 'La categoría es requerida';
    }

    if (!newProductData.unidad_medida_id) {
      newErrors.unidad_medida_id = 'La unidad de medida es requerida';
    }

    if (!newProductData.precio_estimado || newProductData.precio_estimado <= 0) {
      newErrors.precio_estimado = 'El precio estimado debe ser mayor a 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (showCreateProduct) {
      if (validateNewProduct()) {
        try {
          const success = await createInventoryProduct({
            nombre: newProductData.nombre,
            categoria_id: newProductData.categoria_id,
            unidad_medida_id: newProductData.unidad_medida_id,
            precio_estimado: newProductData.precio_estimado,
            descripcion: '',
            es_perecedero: false, // Valor por defecto
          });
          if (success) {
            setShowCreateProduct(false);
            // Reset form
            setNewProductData({
              nombre: '',
              categoria_id: categories[0]?.id || '',
              precio_estimado: 0,
              unidad_medida_id: units[0]?.id || '',
            });
          }
        } catch (error) {
          console.error('Error creando producto:', error);
        }
      }
    } else {
      if (validateProductForm()) {
        if (selectedProduct?.isFromInventory) {
          // Si es del inventario, usar el servicio de inventario
          const success = await addProductToContainer({
            producto_id: formData.producto_id,
            contenedor_id: formData.contenedor_id,
            cantidad: formData.cantidad,
            empaquetado: formData.empaquetado,
            fecha_vencimiento: formData.fecha_vencimiento || undefined,
            precio_real_unidad: formData.precio_real_unidad || 0,
            estado_producto_id: formData.estado_producto_id || undefined,
          });
          
          if (success) {
            onClose();
          }
        } else {
          // Si es recomendado, usar el método original
          onSubmit(formData);
        }
      }
    }
  };

  const handleBack = () => {
    if (step === 'configure') {
      setStep('select');
      setSelectedProduct(null);
      setFormData(prev => ({
        ...prev,
        producto_id: '',
        precio_real_unidad: 0,
      }));
    } else if (showCreateProduct) {
      setShowCreateProduct(false);
    }
  };

  // Inicializar valores por defecto para nuevo producto
  useEffect(() => {
    if (categories.length > 0 && units.length > 0 && !newProductData.categoria_id) {
      setNewProductData(prev => ({
        ...prev,
        categoria_id: categories[0].id,
        unidad_medida_id: units[0].id,
      }));
    }
  }, [categories, units, newProductData.categoria_id]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div className="relative top-10 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-lg bg-white mb-10">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-700">Cargando productos...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-full max-w-5xl shadow-lg rounded-lg bg-white mb-10">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {showCreateProduct ? 'Registrar Producto' : 'Agregar Producto al Contenedor'}
              </h3>
              <p className="text-sm text-gray-500">
                {showCreateProduct 
                  ? 'Información básica del producto'
                  : `${container.nombre} - ${step === 'select' ? 'Selecciona el producto' : 'Configura las cantidades'}`
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
              <FormField
                label="Nombre del Producto"
                error={errors.nombre}
                required
              >
                <input
                  type="text"
                  value={newProductData.nombre}
                  onChange={handleInputChange("nombre")}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.nombre ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Ej: Lenguado filetes, Inca Kola, Aceite vegetal..."
                  autoFocus
                />
              </FormField>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Categoría"
                  error={errors.categoria_id}
                  required
                >
                  <select
                    value={newProductData.categoria_id}
                    onChange={handleInputChange("categoria_id")}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      errors.categoria_id ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Seleccionar categoría...</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>{category.nombre}</option>
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
                    value={newProductData.unidad_medida_id}
                    onChange={handleInputChange("unidad_medida_id")}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      errors.unidad_medida_id ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Seleccionar unidad...</option>
                    {units.map(unit => (
                      <option key={unit.id} value={unit.id}>{unit.nombre} ({unit.abreviatura})</option>
                    ))}
                  </select>
                </FormField>
              </div>

              <FormField
                label="Precio Unitario Estimado (S/)"
                error={errors.precio_estimado}
                required
                icon={DollarSign}
              >
                <input
                  type="number"
                  value={newProductData.precio_estimado || ''}
                  onChange={handleInputChange("precio_estimado")}
                  min="0"
                  step="0.01"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.precio_estimado ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="0.00"
                />
              </FormField>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  ← Volver
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

                  {/* Products Display */}
                  <div className="max-h-96 overflow-y-auto space-y-6">
                    <ProductSection
                      title="Productos en Inventario"
                      products={filteredInventoryProducts}
                      icon={Star}
                      onProductSelect={handleProductSelect}
                      badge="Preferidos"
                    />
                    
                    <ProductSection
                      title="Productos Recomendados"
                      products={filteredRecommendedProducts}
                      icon={Archive}
                      onProductSelect={handleProductSelect}
                    />
                  </div>

                  {!loading && filteredInventoryProducts.length === 0 && filteredRecommendedProducts.length === 0 && (
                    <div className="text-center py-8">
                      <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No se encontraron productos
                      </h3>
                      <p className="text-gray-600">
                        {searchTerm ? 'Intenta con otros términos de búsqueda' : 'No hay productos disponibles'}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {step === 'configure' && selectedProduct && (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Selected Product Info */}
                  <div className={`border rounded-lg p-4 ${
                    selectedProduct.isFromInventory 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-blue-50 border-blue-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className={`font-medium ${
                            selectedProduct.isFromInventory ? 'text-green-900' : 'text-blue-900'
                          }`}>
                            {selectedProduct.nombre}
                          </h4>
                          {selectedProduct.isFromInventory && (
                            <Star className="w-4 h-4 text-green-600 fill-current" />
                          )}
                        </div>
                        <p className={`text-sm ${
                          selectedProduct.isFromInventory ? 'text-green-700' : 'text-blue-700'
                        }`}>
                          {selectedProduct.categoria}
                        </p>
                        <p className={`text-sm font-medium ${
                          selectedProduct.isFromInventory ? 'text-green-800' : 'text-blue-800'
                        }`}>
                          S/ {selectedProduct.precio_base.toFixed(2)} / {selectedProduct.unidad_medida}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleBack}
                        className={`text-sm font-medium ${
                          selectedProduct.isFromInventory 
                            ? 'text-green-600 hover:text-green-700' 
                            : 'text-blue-600 hover:text-blue-700'
                        }`}
                      >
                        Cambiar producto
                      </button>
                    </div>
                  </div>

                  {/* Configuration Form */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      label="Cantidad"
                      error={errors.cantidad}
                      required
                      icon={Scale}
                    >
                      <div className="relative">
                        <input
                          type="number"
                          value={formData.cantidad || ''}
                          onChange={handleInputChange("cantidad")}
                          placeholder="0"
                          step="0.01"
                          min="0"
                          className={`w-full px-3 py-2 pr-16 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors.cantidad ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                          {selectedProduct.unidad_medida}
                        </span>
                      </div>
                    </FormField>

                    <FormField
                      label={`Precio por ${selectedProduct.unidad_medida}`}
                      error={errors.precio_real_unidad}
                      required
                      icon={DollarSign}
                    >
                      <input
                        type="number"
                        value={formData.precio_real_unidad || ''}
                        onChange={handleInputChange("precio_real_unidad")}
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.precio_real_unidad ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {/* Total value calculation */}
                      {formData.cantidad > 0 && formData.precio_real_unidad && formData.precio_real_unidad > 0 && (
                        <p className="mt-1 text-sm text-gray-600">
                          Valor total: <strong>S/ {(formData.cantidad * formData.precio_real_unidad).toFixed(2)}</strong>
                        </p>
                      )}
                    </FormField>

                    <FormField
                      label="Estado del Producto"
                      icon={Thermometer}
                    >
                      <select
                        value={formData.estado_producto_id}
                        onChange={handleInputChange("estado_producto_id")}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Seleccionar estado...</option>
                        {productStates.map(state => (
                          <option key={state.id} value={state.id}>{state.nombre}</option>
                        ))}
                      </select>
                    </FormField>

                    <FormField
                      label="Fecha de Vencimiento"
                      icon={Calendar}
                    >
                      <input
                        type="date"
                        value={formData.fecha_vencimiento}
                        onChange={handleInputChange("fecha_vencimiento")}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <p className="mt-1 text-xs text-gray-500">Opcional - Dejar vacío si no aplica</p>
                    </FormField>

                    <FormField
                      label="Empaquetado"
                      icon={Package}
                    >
                      <input
                        type="text"
                        value={formData.empaquetado || ''}
                        onChange={handleInputChange("empaquetado")}
                        placeholder="Ej: 1 bolsa, 2 kg, etc."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </FormField>
                  </div>

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
                        className={`px-4 py-2 text-sm font-medium text-white border border-transparent rounded-lg transition-colors ${
                          selectedProduct.isFromInventory
                            ? 'bg-green-600 hover:bg-green-700'
                            : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                      >
                        {selectedProduct.isFromInventory ? 'Agregar desde Inventario' : 'Agregar al Contenedor'}
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
// src/features/containers/components/views/ContainerProductsView.tsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Plus, 
  Package, 
  Search, 
  Filter
} from 'lucide-react';
import type { ContainerProduct, Container, ProductFormData } from '../../types/container.types';
import type { InventoryProduct } from '../../data/mockProductData';
import { mockContainers, getContainerProducts } from '../../data/mockContainerData';
import { mockInventoryProducts } from '../../data/mockProductData';
import ProductForm from '../forms/ProductForm';
import ProductsTable from '../tables/ProductsTable';
import SummaryStats from '../ui/SummaryStats';
import StatusBadge from '../shared/StatusBadge';

const ContainerProductsView: React.FC = () => {
  const { containerId } = useParams<{ containerId: string }>();
  const navigate = useNavigate();
  
  const [container, setContainer] = useState<Container | null>(null);
  const [products, setProducts] = useState<ContainerProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ContainerProduct[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [stateFilter, setStateFilter] = useState<string>('all');
  const [showProductForm, setShowProductForm] = useState(false);
  const [inventoryProducts, setInventoryProducts] = useState<InventoryProduct[]>(mockInventoryProducts);

  useEffect(() => {
    if (containerId) {
      // Cargar datos del contenedor
      const containerData = mockContainers.find(c => c.id === containerId);
      setContainer(containerData || null);
      
      // Cargar productos del contenedor
      const containerProducts = getContainerProducts(containerId);
      setProducts(containerProducts);
      setFilteredProducts(containerProducts);
    }
  }, [containerId]);

  // Filtrar productos
  useEffect(() => {
    let filtered = products;

    // Filtro por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por estado
    if (stateFilter !== 'all') {
      filtered = filtered.filter(product => product.state === stateFilter);
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, stateFilter]);

  const handleAddProduct = () => {
    setShowProductForm(true);
  };

  const handleCreateNewProduct = (productData: Partial<InventoryProduct>) => {
    // Generar ID único para el nuevo producto
    const newId = (Math.max(...inventoryProducts.map(p => parseInt(p.id))) + 1).toString();
    
    const newProduct: InventoryProduct = {
      id: newId,
      name: productData.name || '',
      category: productData.category || '',
      basePrice: productData.basePrice || 0,
      unit: productData.unit || 'kg',
      description: productData.description || '',
      isPerishable: productData.isPerishable || false,
      recommendedContainerTypes: productData.recommendedContainerTypes || [],
      createdAt: new Date(),
    };

    // Actualizar lista de productos del inventario
    setInventoryProducts(prev => [...prev, newProduct]);
    
    console.log('Nuevo producto creado:', newProduct);
    // TODO: Aquí se podría hacer la llamada al backend para guardar el producto
  };

  const handleSubmitProduct = (formData: ProductFormData) => {
    if (!container) return;

    // Encontrar el producto del inventario
    const inventoryProduct = inventoryProducts.find(p => p.id === formData.productId);
    if (!inventoryProduct) {
      console.error('Producto no encontrado en inventario');
      return;
    }

    // Calcular la cantidad por empaquetado
    const quantityPerPackage = formData.totalQuantity / formData.packagedUnits;

    // Determinar estado basado en fecha de vencimiento si no se especifica
    let finalState = formData.state;
    if (formData.expiryDate && inventoryProduct.isPerishable) {
      // Aquí podrías llamar a una función calculateProductState si existe
      // finalState = calculateProductState(new Date(formData.expiryDate));
    }

    // Crear los registros de productos empaquetados
    const newProducts: ContainerProduct[] = [];
    for (let i = 0; i < formData.packagedUnits; i++) {
      const newProductId = `${Date.now()}-${i}`;
      
      const newProduct: ContainerProduct = {
        id: newProductId,
        productId: formData.productId,
        productName: inventoryProduct.name,
        containerId: container.id,
        containerName: container.name,
        category: inventoryProduct.category,
        totalQuantity: quantityPerPackage,
        unit: inventoryProduct.unit,
        packagedUnits: 1, // Cada registro representa 1 empaquetado
        quantityPerPackage: quantityPerPackage,
        expiryDate: formData.expiryDate ? new Date(formData.expiryDate) : undefined,
        state: finalState,
        price: formData.price,
        createdAt: new Date(),
      };

      newProducts.push(newProduct);
    }

    // Actualizar la lista de productos
    setProducts(prev => [...prev, ...newProducts]);
    setShowProductForm(false);
    
    console.log('Productos agregados:', newProducts);
    // TODO: Aquí se haría la llamada al backend para guardar los productos
  };

  const handleEditProduct = (productId: string) => {
    console.log('Editar producto:', productId);
    // TODO: Implementar edición de producto
  };

  const handleDeleteProduct = (productId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      setProducts(prev => prev.filter(p => p.id !== productId));
      console.log('Producto eliminado:', productId);
      // TODO: Hacer llamada al backend para eliminar
    }
  };

  if (!container) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Contenedor no encontrado</h3>
          <button
            onClick={() => navigate('/containers')}
            className="text-blue-600 hover:text-blue-700"
          >
            Volver a contenedores
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-6">
          <button
            onClick={() => navigate('/containers')}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{container.name}</h1>
            <p className="text-gray-600">
              Productos almacenados • {filteredProducts.length} de {products.length} productos
            </p>
          </div>
          <button
            onClick={handleAddProduct}
            className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
          >
            <Plus className="w-5 h-5" />
            <span>Agregar Producto</span>
          </button>
        </div>

        {/* Container Info */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-500">Capacidad</p>
              <p className="font-semibold text-gray-900">
                {container.currentLoad} / {container.capacity} kg
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div 
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${(container.currentLoad / container.capacity) * 100}%` }}
                />
              </div>
            </div>
            
            {container.temperature !== undefined && (
              <div>
                <p className="text-sm text-gray-500">Temperatura</p>
                <p className="font-semibold text-gray-900">{container.temperature}°C</p>
              </div>
            )}
            
            {container.humidity !== undefined && (
              <div>
                <p className="text-sm text-gray-500">Humedad</p>
                <p className="font-semibold text-gray-900">{container.humidity}%</p>
              </div>
            )}
            
            <div>
              <p className="text-sm text-gray-500">Estado</p>
              <StatusBadge status={container.status} />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
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
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={stateFilter}
                onChange={(e) => setStateFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Todos los estados</option>
                <option value="fresco">Fresco</option>
                <option value="congelado">Congelado</option>
                <option value="por-vencer">Por vencer</option>
                <option value="vencido">Vencido</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Table */}
        {filteredProducts.length > 0 ? (
          <ProductsTable
            products={filteredProducts}
            onEdit={handleEditProduct}
            onDelete={handleDeleteProduct}
          />
        ) : (
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {products.length === 0 ? 'No hay productos' : 'No se encontraron productos'}
              </h3>
              <p className="text-gray-600 mb-4">
                {products.length === 0 
                  ? 'Este contenedor no tiene productos almacenados.'
                  : 'No hay productos que coincidan con los filtros seleccionados.'
                }
              </p>
              {products.length === 0 ? (
                <button
                  onClick={handleAddProduct}
                  className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Agregar Primer Producto</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setStateFilter('all');
                  }}
                  className="text-blue-600 hover:text-blue-700"
                >
                  Limpiar filtros
                </button>
              )}
            </div>
          </div>
        )}

        {/* Summary Footer */}
        {filteredProducts.length > 0 && (
          <SummaryStats filteredProducts={filteredProducts} />
        )}

        {/* Product Form Modal */}
        {showProductForm && container && (
          <ProductForm
            container={container}
            onSubmit={handleSubmitProduct}
            onClose={() => setShowProductForm(false)}
            onCreateNewProduct={handleCreateNewProduct}
          />
        )}
      </div>
    </div>
  );
};

export default ContainerProductsView;
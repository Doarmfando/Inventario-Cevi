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
import { ContainerService } from '../../services/ContainerService';
import type { ContainerProduct, ContainerWithDetails, ProductToContainerFormData } from '../../types/container.types';
import ProductsTable from '../tables/ProductsTable';
import ProductForm from '../forms/ProductForm';

const ContainerProductsView: React.FC = () => {
  const { containerId } = useParams<{ containerId: string }>();
  const navigate = useNavigate();
  
  const [container, setContainer] = useState<ContainerWithDetails | null>(null);
  const [products, setProducts] = useState<ContainerProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ContainerProduct[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [stateFilter, setStateFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);

  // Cargar datos del contenedor y productos
  useEffect(() => {
    if (containerId) {
      loadContainerData();
    }
  }, [containerId]);

  const loadContainerData = async () => {
    if (!containerId) return;
    
    try {
      setLoading(true);
      setError(null);

      // Cargar datos del contenedor
      const containers = await ContainerService.getContenedores();
      const containerData = containers.find(c => c.id === containerId);
      
      if (!containerData) {
        setError('Contenedor no encontrado');
        return;
      }

      setContainer(containerData);
      
      // Cargar productos del contenedor
      const containerProducts = await ContainerService.getContainerProducts(containerId);
      setProducts(containerProducts);
      setFilteredProducts(containerProducts);
    } catch (err) {
      console.error('Error cargando datos del contenedor:', err);
      setError('Error al cargar los datos del contenedor');
    } finally {
      setLoading(false);
    }
  };

  // Filtrar productos
  useEffect(() => {
    let filtered = products;

    // Filtro por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.producto_nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.categoria.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por estado
    if (stateFilter !== 'all') {
      filtered = filtered.filter(product => product.estado_calculado === stateFilter);
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, stateFilter]);

  const handleAddProduct = () => {
    setShowProductForm(true);
  };

  const handleSubmitProduct = async (formData: ProductToContainerFormData) => {
    try {
      const success = await ContainerService.agregarProductoAContenedor(formData);
      
      if (success) {
        setShowProductForm(false);
        // Recargar productos del contenedor
        await loadContainerData();
      } else {
        alert('Error al agregar el producto al contenedor');
      }
    } catch (error) {
      console.error('Error agregando producto:', error);
      alert('Error al agregar el producto al contenedor');
    }
  };

  const handleCloseProductForm = () => {
    setShowProductForm(false);
  };

  const handleEditProduct = (productId: string) => {
    console.log('Editar producto:', productId);
    // Implementar edición de producto
    alert('Funcionalidad de editar producto en desarrollo');
  };

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        // Aquí iría la llamada al servicio para eliminar
        // await ContainerService.eliminarProductoDeContenedor(productId);
        
        // Por ahora solo eliminar del estado local
        setProducts(prev => prev.filter(p => p.id !== productId));
        console.log('Producto eliminado:', productId);
      } catch (err) {
        console.error('Error eliminando producto:', err);
        alert('Error al eliminar el producto');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="text-gray-700">Cargando contenedor...</span>
        </div>
      </div>
    );
  }

  if (error || !container) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {error || 'Contenedor no encontrado'}
          </h3>
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
            <h1 className="text-2xl font-bold text-gray-900">{container.nombre}</h1>
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
                {container.cantidad_total} / {container.capacidad || 'N/A'} unidades
              </p>
              {container.capacidad && (
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div 
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${Math.min((container.cantidad_total / container.capacidad) * 100, 100)}%` }}
                  />
                </div>
              )}
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Tipo</p>
              <p className="font-semibold text-gray-900">{container.tipo_contenedor_nombre}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Total Productos</p>
              <p className="font-semibold text-gray-900">{container.total_productos}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Valor Total</p>
              <p className="font-semibold text-green-600">
                S/ {container.valor_total.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Frescos</p>
                <p className="text-xl font-semibold text-green-600">
                  {container.total_productos - container.productos_vencidos - container.productos_por_vencer}
                </p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Package className="w-4 h-4 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Por Vencer</p>
                <p className="text-xl font-semibold text-orange-600">{container.productos_por_vencer}</p>
              </div>
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <Package className="w-4 h-4 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Vencidos</p>
                <p className="text-xl font-semibold text-red-600">{container.productos_vencidos}</p>
              </div>
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <Package className="w-4 h-4 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Cantidad Total</p>
                <p className="text-xl font-semibold text-blue-600">{container.cantidad_total}</p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Package className="w-4 h-4 text-blue-600" />
              </div>
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
                <option value="por_vencer">Por vencer</option>
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

        {/* Product Form Modal */}
        {showProductForm && container && (
          <ProductForm
            container={container}
            onSubmit={handleSubmitProduct}
            onClose={handleCloseProductForm}
          />
        )}
      </div>
    </div>
  );
};

export default ContainerProductsView;
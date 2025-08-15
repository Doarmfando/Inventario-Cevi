import React, { useState } from "react";
import { Eye, Edit3, Trash2, Search, Filter, AlertTriangle, Clock, Refrigerator } from "lucide-react";
import type { Product } from "../types";

interface Props {
  products: Product[];
  onDelete: (id: number) => void;
}

const ProductTable: React.FC<Props> = ({ products, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedContainer, setSelectedContainer] = useState<string>('');
  const [selectedState, setSelectedState] = useState<string>('');

  const handleDeleteProduct = (id: number): void => {
    const confirmed = window.confirm('¿Estás seguro de eliminar este producto del inventario?');
    if (confirmed) {
      onDelete(id);
    }
  };

  const filteredProducts = products.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    const matchesContainer = !selectedContainer || item.container === selectedContainer;
    const matchesState = !selectedState || item.state === selectedState;
    return matchesSearch && matchesCategory && matchesContainer && matchesState;
  });

  const categories = [...new Set(products.map(item => item.category))];
  const containers = [...new Set(products.map(item => item.container))];
  const states = ['fresco', 'congelado', 'por-vencer', 'vencido'];

  // Función para obtener color del estado
  const getStateColor = (state: string, quantity: number, minStock: number) => {
    if (state === 'vencido') return 'bg-red-100 text-red-800';
    if (state === 'por-vencer') return 'bg-yellow-100 text-yellow-800';
    if (quantity <= minStock) return 'bg-orange-100 text-orange-800';
    if (state === 'congelado') return 'bg-blue-100 text-blue-800';
    return 'bg-green-100 text-green-800';
  };

  // Función para obtener texto del estado
  const getStateText = (state: string, quantity: number, minStock: number) => {
    if (state === 'vencido') return 'Vencido';
    if (state === 'por-vencer') return 'Por Vencer';
    if (quantity <= minStock) return 'Stock Bajo';
    if (state === 'congelado') return 'Congelado';
    return 'Fresco';
  };

  // Función para calcular días hasta vencimiento
  const getDaysUntilExpiry = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-4">
      {/* Controles de búsqueda y filtros */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar productos o proveedores..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex flex-wrap gap-3">
            <div className="relative min-w-[140px]">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none pl-9 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-sm"
              >
                <option value="">Todas las categorías</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div className="relative min-w-[140px]">
              <Refrigerator className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={selectedContainer}
                onChange={(e) => setSelectedContainer(e.target.value)}
                className="appearance-none pl-9 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-sm"
              >
                <option value="">Todos los contenedores</option>
                {containers.map(container => (
                  <option key={container} value={container}>{container}</option>
                ))}
              </select>
            </div>

            <div className="relative min-w-[120px]">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="appearance-none pl-9 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-sm"
              >
                <option value="">Todos los estados</option>
                {states.map(state => (
                  <option key={state} value={state}>
                    {state.charAt(0).toUpperCase() + state.slice(1).replace('-', ' ')}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Producto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoría
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cantidad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precio Unit.
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contenedor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vencimiento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => {
                const daysUntilExpiry = getDaysUntilExpiry(product.expiryDate);
                return (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-xs text-gray-500">{product.supplier}</div>
                        </div>
                        {(product.state === 'vencido' || product.state === 'por-vencer') && (
                          <AlertTriangle className="w-4 h-4 text-yellow-500 ml-2" />
                        )}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {product.category}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {product.quantity} {product.unit}
                      </div>
                      <div className="text-xs text-gray-500">Mín: {product.minStock} {product.unit}</div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        S/ {product.price.toLocaleString("es-PE", { minimumFractionDigits: 2 })}
                      </div>
                      <div className="text-xs text-gray-500">
                        Total: S/ {(product.quantity * product.price).toLocaleString("es-PE", { minimumFractionDigits: 2 })}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-xs text-gray-900">{product.container}</div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(product.expiryDate).toLocaleDateString('es-PE')}
                      </div>
                      <div className={`text-xs ${
                        daysUntilExpiry < 0 ? 'text-red-600' : 
                        daysUntilExpiry <= 3 ? 'text-yellow-600' : 
                        'text-gray-500'
                      }`}>
                        {daysUntilExpiry < 0 ? `Vencido hace ${Math.abs(daysUntilExpiry)} días` :
                         daysUntilExpiry === 0 ? 'Vence hoy' :
                         `${daysUntilExpiry} días restantes`}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        getStateColor(product.state, product.quantity, product.minStock)
                      }`}>
                        {getStateText(product.state, product.quantity, product.minStock)}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50 transition-colors" 
                          title="Ver detalles"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          className="text-green-600 hover:text-green-800 p-1 rounded hover:bg-green-50 transition-colors" 
                          title="Editar"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mensaje cuando no hay productos */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8l-4 4m0 0l-4-4m4 4V3" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay productos disponibles</h3>
            <p className="text-gray-500">
              {searchTerm || selectedCategory || selectedContainer || selectedState 
                ? 'No se encontraron productos con los filtros aplicados' 
                : 'Comienza agregando productos a tu inventario'}
            </p>
          </div>
        )}
      </div>

      {/* Información de resultados y resumen */}
      {filteredProducts.length > 0 && (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-600">
              Mostrando {filteredProducts.length} de {products.length} productos
            </div>
            
            <div className="flex flex-wrap gap-4 text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-100 rounded-full"></div>
                <span className="text-gray-600">
                  {filteredProducts.filter(p => p.state === 'vencido').length} Vencidos
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-100 rounded-full"></div>
                <span className="text-gray-600">
                  {filteredProducts.filter(p => p.state === 'por-vencer').length} Por vencer
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-orange-100 rounded-full"></div>
                <span className="text-gray-600">
                  {filteredProducts.filter(p => p.quantity <= p.minStock).length} Stock bajo
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductTable;
import React from "react";
import { Search, Filter, Clock, Plus, Package } from "lucide-react";

interface TableFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  selectedState: string;
  setSelectedState: (value: string) => void;
  selectedContainer: string;
  setSelectedContainer: (value: string) => void;
  categories: string[];
  containers: string[];
  onAddProduct?: () => void;
}

const TableFilters: React.FC<TableFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  selectedState,
  setSelectedState,
  selectedContainer,
  setSelectedContainer,
  categories,
  containers,
  onAddProduct
}) => {
  const states = ['fresco', 'congelado', 'por-vencer', 'vencido'];

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex flex-col lg:flex-row gap-4 flex-1">
          {/* Search Input */}
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
            {/* Category Filter */}
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

            {/* Container Filter */}
            <div className="relative min-w-[180px]">
              <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
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

            {/* State Filter */}
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
        
        {/* Add Product Button */}
        {onAddProduct && (
          <button
            onClick={onAddProduct}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Agregar Producto</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default TableFilters;
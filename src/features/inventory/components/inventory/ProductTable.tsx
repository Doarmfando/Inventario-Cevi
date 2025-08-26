import React, { useState, useMemo } from "react";
import type { ProductWithCalculatedData } from "../../types";
import TableFilters from "../table/TableFilters";
import ProductTableRow from "../table/ProductTableRow";
import TableSummary from "../table/TableSummary";
import EmptyState from "../table/EmptyState";

interface Props {
  products: ProductWithCalculatedData[]; // Ya vienen con datos calculados del hook
  onDelete: (id: number) => void;
  onAddProduct?: () => void;
  onEdit?: (product: ProductWithCalculatedData) => void;
  onView?: (product: ProductWithCalculatedData) => void;
}

const ProductTable: React.FC<Props> = ({ 
  products, 
  onDelete, 
  onAddProduct,
  onEdit,
  onView 
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedContainer, setSelectedContainer] = useState<string>('');

  // Categorías únicas para el filtro
  const categories = useMemo(() => 
    [...new Set(products.map(item => item.category))], 
    [products]
  );

  // Contenedores únicos para el filtro
  const containers = useMemo(() => 
    [...new Set(products.map(item => item.container))], 
    [products]
  );

  // Productos filtrados
  const filteredProducts = useMemo(() => {
    return products.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.supplier.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || item.category === selectedCategory;
      const matchesState = !selectedState || item.state === selectedState;
      const matchesContainer = !selectedContainer || item.container === selectedContainer;
      return matchesSearch && matchesCategory && matchesState && matchesContainer;
    });
  }, [products, searchTerm, selectedCategory, selectedState, selectedContainer]);

  const hasFilters = Boolean(searchTerm || selectedCategory || selectedState || selectedContainer);

  return (
    <div className="space-y-4">
      {/* Filtros y búsqueda */}
      <TableFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedState={selectedState}
        setSelectedState={setSelectedState}
        selectedContainer={selectedContainer}
        setSelectedContainer={setSelectedContainer}
        categories={categories}
        containers={containers}
        onAddProduct={onAddProduct}
      />

      {/* Tabla */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b-2 border-gray-200">
              <tr>
                {/* 1. Producto */}
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  <div className="flex items-center space-x-1">
                    <span>Producto</span>
                  </div>
                </th>
                
                {/* 2. Contenedor */}
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Contenedor
                </th>
                
                {/* 3. Categoría */}
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Categoría
                </th>
                
                {/* 4. Unidad
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Unidad
                </th> */}
                
                {/* 5. Stock Total */}
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Stock Total
                </th>

                {/* 6. Estado Stock */}
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Estado Stock
                </th>
                
                {/* 7. Precio Unitario
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Precio Unitario
                </th> */}

                {/* 8. Valor Total */}
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Valor Total
                </th>

                {/* 9. Empaquetados */}
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Empaquetados
                </th>
                
                {/* 10. # Por Vencer
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  <div className="flex flex-col">
                    <span># Por</span>
                    <span>Vencer</span>
                  </div>
                </th> */}
                
                {/* 11. Acciones */}
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <ProductTableRow
                  key={product.id}
                  product={product}
                  onDelete={onDelete}
                  onEdit={onEdit}
                  onView={onView}
                />
              ))}
            </tbody>
          </table>
        </div>

        {/* Estado vacío */}
        {filteredProducts.length === 0 && (
          <EmptyState hasFilters={hasFilters} />
        )}
      </div>

      {/* Resumen */}
      <TableSummary 
        filteredProducts={filteredProducts}
        totalProducts={products.length}
      />
    </div>
  );
};

export default ProductTable;
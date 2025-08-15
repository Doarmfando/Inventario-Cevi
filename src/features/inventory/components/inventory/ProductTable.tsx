import React, { useState, useMemo } from "react";
import type { Product } from "../../types";
import TableFilters from "../table/TableFilters";
import ProductTableRow from "../table/ProductTableRow";
import TableSummary from "../table/TableSummary";
import EmptyState from "../table/EmptyState";

interface Props {
  products: Product[];
  onDelete: (id: number) => void;
  onAddProduct?: () => void;
}

const ProductTable: React.FC<Props> = ({ products, onDelete, onAddProduct }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedState, setSelectedState] = useState<string>('');

  // Categorías únicas para el filtro
  const categories = useMemo(() => 
    [...new Set(products.map(item => item.category))], 
    [products]
  );

  // Productos filtrados
  const filteredProducts = useMemo(() => {
    return products.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.supplier.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || item.category === selectedCategory;
      const matchesState = !selectedState || item.state === selectedState;
      return matchesSearch && matchesCategory && matchesState;
    });
  }, [products, searchTerm, selectedCategory, selectedState]);

  const hasFilters = Boolean(searchTerm || selectedCategory || selectedState);

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
        categories={categories}
        onAddProduct={onAddProduct}
      />

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
                {/* TEMPORALMENTE OCULTO - COLUMNA DE CONTENEDORES */}
                {/*
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contenedor
                </th>
                */}
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
              {filteredProducts.map((product) => (
                <ProductTableRow
                  key={product.id}
                  product={product}
                  onDelete={onDelete}
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
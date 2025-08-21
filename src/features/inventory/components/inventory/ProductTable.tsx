import React, { useState, useMemo } from "react";
import type { Product, ProductWithCalculatedData, StockStatus } from "../../types";
import TableFilters from "../table/TableFilters";
import ProductTableRow from "../table/ProductTableRow";
import TableSummary from "../table/TableSummary";
import EmptyState from "../table/EmptyState";

interface Props {
  products: Product[];
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

  // Función para calcular el estado del stock
  const getStockStatus = (quantity: number, minStock: number): StockStatus => {
    if (quantity === 0) return 'Sin Stock';
    if (quantity <= minStock * 0.5) return 'Stock Bajo';
    if (quantity <= minStock) return 'Reponer Pronto';
    return 'Stock OK';
  };

  // Función para calcular días hasta vencimiento
  const calculateDaysToExpiry = (expiryDate: string): number => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Transformar productos a ProductWithCalculatedData
  const productsWithCalculatedData = useMemo((): ProductWithCalculatedData[] => {
    return products.map(product => ({
      ...product,
      stockStatus: getStockStatus(product.quantity, product.minStock),
      totalValue: product.quantity * product.price,
      estimatedDaysToExpiry: calculateDaysToExpiry(product.expiryDate)
    }));
  }, [products]);

  // Categorías únicas para el filtro
  const categories = useMemo(() => 
    [...new Set(productsWithCalculatedData.map(item => item.category))], 
    [productsWithCalculatedData]
  );

  // Productos filtrados
  const filteredProducts = useMemo(() => {
    return productsWithCalculatedData.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.supplier.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || item.category === selectedCategory;
      const matchesState = !selectedState || item.state === selectedState;
      return matchesSearch && matchesCategory && matchesState;
    });
  }, [productsWithCalculatedData, searchTerm, selectedCategory, selectedState]);

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
            <thead className="bg-gray-50 border-b-2 border-gray-200">
              <tr>
                {/* Producto - Coincide con ProductTableRow línea 83 */}
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  <div className="flex items-center space-x-1">
                    <span>Producto</span>
                  </div>
                </th>
                
                {/* Categoría - Coincide con ProductTableRow línea 94 */}
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Categoría
                </th>
                
                {/* Unidad - Coincide con ProductTableRow línea 101 */}
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Unidad
                </th>
                
                {/* Cantidad - Coincide con ProductTableRow línea 107 */}
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Cantidad
                </th>

                {/* Estado Stock - Coincide con ProductTableRow línea 114 */}
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Estado Stock
                </th>
                
                {/* Precio Unitario - Coincide con ProductTableRow línea 122 */}
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Precio Unitario
                </th>

                {/* Precio Total - Coincide con ProductTableRow línea 131 */}
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Precio Total
                </th>

                {/* CONTENEDORES - COLUMNA FUTURA (comentada pero mantenida) */}
                {/* 
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Contenedores
                </th>
                */}
                
                {/* Días para Vencimiento - Coincide con ProductTableRow línea 142 */}
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  <div className="flex flex-col">
                    <span>Productos por</span>
                    <span>Vencer</span>
                  </div>
                </th>
                
                {/* Estado del Producto - Coincide con ProductTableRow línea 163 */}
                {/* <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Estado
                </th> */}
                
                {/* Acciones - Coincide con ProductTableRow línea 171 */}
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
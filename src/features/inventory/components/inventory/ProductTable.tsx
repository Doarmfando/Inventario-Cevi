// src/features/inventory/components/inventory/ProductTable.tsx
import React, { useState, useMemo } from "react";
import TableFilters from "../table/TableFilters";
import ProductTableRow from "../table/ProductTableRow";
import TableSummary from "../table/TableSummary";
import EmptyState from "../table/EmptyState";

// Tipo compatible con lo que retorna useInventory().products
type ProductTableData = {
  id: string;
  name: string;
  container: string;
  category: string;
  quantity: number;
  unit: string;
  stockStatus: 'Stock OK' | 'Stock Bajo' | 'Reponer' | 'Sin Stock';
  state: 'Stock OK' | 'Stock Bajo' | 'Reponer' | 'Sin Stock';
  price: number;
  totalValue: number;
  minStock: number;
  empaquetados: string;
  packagedUnits: number;
  supplier: string;
  estimatedDaysToExpiry: number;
  weightPerPackage: number;
  packagedExpiryDays: number;
  nearExpiryPackages: number;
  entryDate: string;
  lastUpdated: string;
  expiryDate: string;
  availableStock: number;
  packagedWeight: number;
  porVencer: string;
  _original: any; // ProductoInventario original - ahora es obligatorio
};

interface Props {
  products: ProductTableData[]; // Ya vienen con datos calculados del hook
  onDelete: (id: string) => void; // Cambiado a string para UUIDs
  onAddProduct?: () => void;
  onEdit?: (product: ProductTableData) => void;
  onView?: (product: ProductTableData) => void;
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
                           (item.supplier?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
      
      const matchesCategory = !selectedCategory || item.category === selectedCategory;
      
      // Filtrar por estado usando stockStatus
      const matchesState = !selectedState || item.stockStatus === selectedState;
      
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

      {/* Tabla optimizada para pantalla completa */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-full table-fixed">
            <colgroup>
              {/* Anchos optimizados para 8 columnas en 16.5" */}
              <col className="w-[22%]" /> {/* Producto - Más ancho por ser principal */}
              <col className="w-[14%]" /> {/* Contenedor */}
              <col className="w-[10%]" /> {/* Categoría */}
              <col className="w-[9%]" />  {/* Stock Total */}
              <col className="w-[11%]" /> {/* Estado Stock */}
              <col className="w-[12%]" /> {/* Valor Total */}
              <col className="w-[12%]" /> {/* Empaquetados */}
              <col className="w-[10%]" /> {/* Acciones */}
            </colgroup>
            <thead className="bg-gray-50 border-b-2 border-gray-200">
              <tr>
                {/* 1. Producto */}
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                  Producto
                </th>
                
                {/* 2. Contenedor */}
                <th className="px-2 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                  Contenedor
                </th>
                
                {/* 3. Categoría */}
                <th className="px-2 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                  Categoría
                </th>
                
                {/* 4. Stock Total */}
                <th className="px-2 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                  Stock
                </th>

                {/* 5. Estado Stock */}
                <th className="px-2 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                  Estado
                </th>

                {/* 6. Valor Total */}
                <th className="px-2 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                  Valor
                </th>

                {/* 7. Empaquetados */}
                <th className="px-2 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                  Empaque
                </th>
                
                {/* 8. Acciones */}
                <th className="px-2 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wide">
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
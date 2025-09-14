// src/features/inventory/components/table/TableSummary.tsx
import React from "react";

// Tipo compatible con el producto que retorna useInventory.getProductsWithCalculatedData()
interface ProductForSummary {
  id: string;
  name: string;
  quantity: number;
  minStock: number;
  stockStatus: 'Stock OK' | 'Stock Bajo' | 'Reponer' | 'Sin Stock';
  estimatedDaysToExpiry: number;
  // Agregamos campos calculados para vencimientos (por ahora serán 0)
  porVencer?: string;
}

interface TableSummaryProps {
  filteredProducts: ProductForSummary[];
  totalProducts: number;
}

const TableSummary: React.FC<TableSummaryProps> = ({ 
  filteredProducts, 
  totalProducts 
}) => {
  if (filteredProducts.length === 0) {
    return null;
  }

  // Calcular productos vencidos (estimatedDaysToExpiry <= 0)
  const expiredCount = filteredProducts.filter(p => 
    p.estimatedDaysToExpiry <= 0
  ).length;

  // Calcular productos por vencer (1-3 días)
  const expiringCount = filteredProducts.filter(p => 
    p.estimatedDaysToExpiry > 0 && p.estimatedDaysToExpiry <= 3
  ).length;

  // Calcular productos con stock bajo (usando tu sistema de estados)
  const lowStockCount = filteredProducts.filter(p => 
    p.stockStatus === 'Stock Bajo' || 
    p.stockStatus === 'Reponer' || 
    p.stockStatus === 'Sin Stock'
  ).length;

  // Calcular productos sin stock específicamente
  const outOfStockCount = filteredProducts.filter(p => 
    p.stockStatus === 'Sin Stock'
  ).length;

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-sm text-gray-600">
          Mostrando {filteredProducts.length} de {totalProducts} productos
        </div>
        
        <div className="flex flex-wrap gap-4 text-xs">
          {/* Productos vencidos */}
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-100 rounded-full border-2 border-red-300"></div>
            <span className="text-gray-600">
              {expiredCount} Vencidos
            </span>
          </div>
          
          {/* Productos por vencer */}
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-100 rounded-full border-2 border-yellow-300"></div>
            <span className="text-gray-600">
              {expiringCount} Por vencer
            </span>
          </div>
          
          {/* Stock bajo */}
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-orange-100 rounded-full border-2 border-orange-300"></div>
            <span className="text-gray-600">
              {lowStockCount} Stock bajo
            </span>
          </div>

          {/* Sin stock */}
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-200 rounded-full border-2 border-red-400"></div>
            <span className="text-gray-600">
              {outOfStockCount} Sin stock
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableSummary;
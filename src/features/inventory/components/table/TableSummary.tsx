import React from "react";
import type { Product } from "../../types/";

interface TableSummaryProps {
  filteredProducts: Product[];
  totalProducts: number;
}

const TableSummary: React.FC<TableSummaryProps> = ({ 
  filteredProducts, 
  totalProducts 
}) => {
  if (filteredProducts.length === 0) {
    return null;
  }

  const expiredCount = filteredProducts.filter(p => p.state === 'vencido').length;
  const expiringCount = filteredProducts.filter(p => p.state === 'por-vencer').length;
  const lowStockCount = filteredProducts.filter(p => p.quantity <= p.minStock).length;

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-sm text-gray-600">
          Mostrando {filteredProducts.length} de {totalProducts} productos
        </div>
        
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-100 rounded-full"></div>
            <span className="text-gray-600">
              {expiredCount} Vencidos
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-100 rounded-full"></div>
            <span className="text-gray-600">
              {expiringCount} Por vencer
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-orange-100 rounded-full"></div>
            <span className="text-gray-600">
              {lowStockCount} Stock bajo
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableSummary;
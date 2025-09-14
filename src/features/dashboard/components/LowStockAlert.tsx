import React from "react";
import { AlertTriangle } from "lucide-react";
import type { Product } from "../services/dashboardService";

interface LowStockAlertProps {
  lowStockProducts: Product[];
}

const LowStockAlert: React.FC<LowStockAlertProps> = ({ lowStockProducts }) => {
  if (lowStockProducts.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <AlertTriangle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Stock en buen estado
        </h3>
        <p className="text-gray-600">
          No hay productos con stock bajo en este momento.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
          Productos con Stock Bajo
        </h3>
        <span className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full font-medium">
          {lowStockProducts.length} productos
        </span>
      </div>
      
      <div className="space-y-3">
        {lowStockProducts.map(item => {
          const stockPercentage = item.minStock > 0 ? (item.quantity / item.minStock) * 100 : 0;
          const isReallyLow = stockPercentage < 50;
          
          return (
            <div key={item.id} className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-100">
              <div className="flex-1">
                <p className="font-medium text-gray-800">{item.name}</p>
                <p className="text-sm text-gray-600">
                  Categoría: <span className="font-medium">{item.category}</span>
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Stock actual: <span className="font-medium text-red-600">{item.quantity}</span> | 
                  Mínimo: <span className="font-medium">{item.minStock}</span>
                </p>
                <div className="mt-2 w-full bg-red-200 rounded-full h-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(stockPercentage, 100)}%` }}
                  />
                </div>
                {item.totalValue > 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    Valor: S/. {item.totalValue.toFixed(2)}
                  </p>
                )}
              </div>
              <div className="ml-4 flex flex-col items-end">
                <span className={`px-3 py-1 text-xs rounded-full font-medium mb-1 ${
                  item.quantity === 0
                    ? 'bg-gray-600 text-white'
                    : isReallyLow 
                    ? 'bg-red-600 text-white' 
                    : 'bg-red-500 text-white'
                }`}>
                  {item.quantity === 0 ? 'Sin Stock' : isReallyLow ? 'Crítico' : 'Bajo'}
                </span>
                <span className="text-xs text-gray-500">
                  {stockPercentage.toFixed(0)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {lowStockProducts.length > 0 && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>Recomendación:</strong> Considera hacer un pedido de reposición para los productos marcados como "Crítico" o "Sin Stock".
          </p>
        </div>
      )}
    </div>
  );
};

export default LowStockAlert;
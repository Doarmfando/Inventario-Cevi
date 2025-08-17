import React from "react";
import { AlertTriangle } from "lucide-react";
import type { Product } from "../../inventory/types"; // 👈 importa el tipo global

interface LowStockAlertProps {
  lowStockProducts: Product[];
}

const LowStockAlert: React.FC<LowStockAlertProps> = ({ lowStockProducts }) => {
  if (lowStockProducts.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
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
          const stockPercentage = (item.quantity / item.minStock) * 100;
          const isReallyLow = stockPercentage < 50;
          
          return (
            <div key={item.id} className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-100">
              <div className="flex-1">
                <p className="font-medium text-gray-800">{item.name}</p>
                <p className="text-sm text-gray-600">
                  Stock actual: <span className="font-medium">{item.quantity}</span> | 
                  Mínimo: <span className="font-medium">{item.minStock}</span>
                </p>
                <div className="mt-2 w-full bg-red-200 rounded-full h-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(stockPercentage, 100)}%` }}
                  />
                </div>
              </div>
              <div className="ml-4">
                <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                  isReallyLow 
                    ? 'bg-red-600 text-white' 
                    : 'bg-red-500 text-white'
                }`}>
                  {isReallyLow ? 'Crítico' : 'Bajo'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LowStockAlert;

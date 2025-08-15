import React from "react";
import { AlertTriangle, Clock, TrendingUp } from "lucide-react";
import type { Product } from "../types";

interface AlertsPanelProps {
  expiringProducts: Product[];
  lowStockProducts: Product[];
}

const AlertsPanel: React.FC<AlertsPanelProps> = ({ 
  expiringProducts, 
  lowStockProducts 
}) => {
  // Si no hay alertas, no renderizar nada
  if (expiringProducts.length === 0 && lowStockProducts.length === 0) {
    return null;
  }

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mx-6 mb-4">
      <div className="flex items-center">
        <AlertTriangle className="w-5 h-5 text-yellow-400 mr-2" />
        <div className="flex-1">
          <h3 className="text-sm font-medium text-yellow-800">
            Alertas de Inventario
          </h3>
          <div className="mt-1 text-sm text-yellow-700 space-x-4">
            {expiringProducts.length > 0 && (
              <span className="inline-flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {expiringProducts.length} producto(s) por vencer o vencidos
              </span>
            )}
            {lowStockProducts.length > 0 && (
              <span className="inline-flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                {lowStockProducts.length} producto(s) con stock bajo
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertsPanel;
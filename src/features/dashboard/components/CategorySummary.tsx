import React from "react";
import { Package2, TrendingUp } from "lucide-react";
import type { CategoryData } from "../services/dashboardService";

interface CategorySummaryProps {
  categoryStats: CategoryData[];
}

const CategorySummary: React.FC<CategorySummaryProps> = ({ categoryStats }) => {
  if (categoryStats.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Package2 className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          No hay categorías disponibles
        </h3>
        <p className="text-gray-600">
          Agrega algunos productos con categorías para ver el resumen.
        </p>
      </div>
    );
  }

  const totalValue = categoryStats.reduce((sum, cat) => sum + cat.value, 0);
  const totalCount = categoryStats.reduce((sum, cat) => sum + cat.count, 0);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <Package2 className="w-5 h-5 text-purple-500 mr-2" />
          Resumen por Categorías
        </h3>
        <div className="text-sm text-gray-600">
          {categoryStats.length} categorías • {totalCount} productos
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-800 font-medium">Total Categorías</p>
              <p className="text-2xl font-bold text-purple-600">{categoryStats.length}</p>
            </div>
            <Package2 className="w-6 h-6 text-purple-500" />
          </div>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-800 font-medium">Total Productos</p>
              <p className="text-2xl font-bold text-blue-600">{totalCount}</p>
            </div>
            <TrendingUp className="w-6 h-6 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-800 font-medium">Valor Total</p>
              <p className="text-2xl font-bold text-green-600">S/. {totalValue.toFixed(2)}</p>
            </div>
            <TrendingUp className="w-6 h-6 text-green-500" />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {categoryStats
          .sort((a, b) => b.value - a.value) // Ordenar por valor descendente
          .map((category, index) => {
            const valuePercentage = totalValue > 0 ? (category.value / totalValue) * 100 : 0;
            const countPercentage = totalCount > 0 ? (category.count / totalCount) * 100 : 0;
            
            return (
              <div key={category.category} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <span className="text-lg font-semibold text-gray-800">
                      {category.category}
                    </span>
                    {index === 0 && (
                      <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full font-medium">
                        Mayor valor
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-800">
                      S/. {category.value.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600">
                      {category.count} productos
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Valor ({valuePercentage.toFixed(1)}%)</span>
                      <span>S/. {category.value.toFixed(2)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${valuePercentage}%` }}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Cantidad ({countPercentage.toFixed(1)}%)</span>
                      <span>{category.count} productos</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${countPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>
                
                {category.count > 0 && (
                  <div className="mt-3 text-sm text-gray-600">
                    Valor promedio por producto: <span className="font-medium">S/. {(category.value / category.count).toFixed(2)}</span>
                  </div>
                )}
              </div>
            );
          })}
      </div>

      {categoryStats.length > 0 && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>Análisis:</strong> La categoría con mayor valor es "{categoryStats.sort((a, b) => b.value - a.value)[0]?.category}" 
            con un valor total de S/. {categoryStats.sort((a, b) => b.value - a.value)[0]?.value.toFixed(2)}.
          </p>
        </div>
      )}
    </div>
  );
};

export default CategorySummary;
import React from "react";

interface EmptyStateProps {
  hasFilters: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = ({ hasFilters }) => {
  return (
    <div className="text-center py-12">
      <div className="text-gray-400 mb-4">
        <svg 
          className="w-16 h-16 mx-auto" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={1} 
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8l-4 4m0 0l-4-4m4 4V3" 
          />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        No hay productos disponibles
      </h3>
      <p className="text-gray-500">
        {hasFilters
          ? 'No se encontraron productos con los filtros aplicados' 
          : 'Comienza agregando productos a tu inventario'}
      </p>
    </div>
  );
};

export default EmptyState;
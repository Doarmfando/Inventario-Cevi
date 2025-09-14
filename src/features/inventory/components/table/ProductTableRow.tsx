// src/features/inventory/components/table/ProductTableRow.tsx
import React from "react";
import { Eye, Edit3, Trash2 } from "lucide-react";
import type { ProductoInventario } from "../../types";

// Tipo para el producto con datos calculados (compatible con useInventory)
type ProductWithCalculatedData = {
  id: string;
  name: string;
  container: string;
  category: string;
  quantity: number;
  unit: string;
  stockStatus: ProductoInventario['estado_inventario'];
  state: ProductoInventario['estado_inventario'];
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
  _original: ProductoInventario;
};

// Tipo para el estado de stock (usando los estados de tu sistema)
type StockStatus = ProductoInventario['estado_inventario'];

interface ProductTableRowProps {
  product: ProductWithCalculatedData;
  onDelete: (id: string) => void;
  onEdit?: (product: ProductWithCalculatedData) => void;
  onView?: (product: ProductWithCalculatedData) => void;
}

const ProductTableRow: React.FC<ProductTableRowProps> = ({ 
  product, 
  onDelete, 
  onEdit, 
  onView 
}) => {
  // Función para obtener color del estado de stock
  const getStockStatusColor = (status: StockStatus) => {
    switch (status) {
      case 'Sin Stock': return 'bg-red-100 text-red-800 border-red-200';
      case 'Stock Bajo': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Reponer': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Stock OK': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Función para obtener clase de la fila según urgencia
  const getRowClassName = () => {
    const isExpired = product.estimatedDaysToExpiry <= 0;
    const isUrgent = product.stockStatus === 'Sin Stock' || product.estimatedDaysToExpiry <= 1;
    const isWarning = product.stockStatus === 'Stock Bajo' || product.stockStatus === 'Reponer' || product.estimatedDaysToExpiry <= 3;

    let baseClass = "hover:bg-gray-50 transition-all duration-200";
    
    if (isExpired) return `${baseClass} bg-red-25 border-l-4 border-l-red-400`;
    if (isUrgent) return `${baseClass} bg-orange-25 border-l-4 border-l-orange-400`;
    if (isWarning) return `${baseClass} bg-yellow-25 border-l-4 border-l-yellow-400`;
    
    return baseClass;
  };

  const handleDelete = () => {
    const confirmed = window.confirm(
      `¿Estás seguro de eliminar "${product.name}" del inventario?\n\nEsta acción no se puede deshacer.`
    );
    if (confirmed) {
      onDelete(product.id);
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(product);
    }
  };

  const handleView = () => {
    if (onView) {
      onView(product);
    }
  };

  // Formatear el texto del estado para mostrar
  const getStatusDisplayText = (status: StockStatus) => {
    switch (status) {
      case 'Stock OK': return 'OK';
      case 'Stock Bajo': return 'Bajo';
      case 'Sin Stock': return 'Sin Stock';
      case 'Reponer': return 'Reponer';
      default: return status;
    }
  };

  return (
    <tr className={getRowClassName()}>
      {/* 1. Producto - 22% */}
      <td className="px-3 py-3">
        <div className="flex items-center space-x-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-1">
              <div className="text-sm font-medium text-gray-900 truncate">
                {product.name}
              </div>
            </div>
            <div className="text-xs text-gray-400 mt-0.5">
              Mín: {product.minStock} {product.unit}
            </div>
          </div>
        </div>
      </td>
      
      {/* 2. Contenedor - 14% */}
      <td className="px-2 py-3">
        <div className="text-sm text-gray-900 font-medium truncate">
          {product.container.replace(' - ', '\n')}
        </div>
        <div className="text-xs text-gray-500">Ubicación</div>
      </td>
      
      {/* 3. Categoría - 10% */}
      <td className="px-2 py-3">
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
          {product.category}
        </span>
      </td>
      
      {/* 4. Stock Total - 9% */}
      <td className="px-2 py-3">
        <div className="text-sm font-semibold text-gray-900">
          {product.quantity.toLocaleString('es-PE')}
        </div>
        <div className="text-xs text-gray-500">{product.unit}</div>
      </td>

      {/* 5. Estado Stock - 11% */}
      <td className="px-2 py-3">
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${
          getStockStatusColor(product.stockStatus)
        }`}>
          {getStatusDisplayText(product.stockStatus)}
        </span>
      </td>

      {/* 6. Valor Total - 12% */}
      <td className="px-2 py-3">
        <div className="text-sm font-semibold text-gray-900">
          S/ {product.totalValue.toLocaleString("es-PE", { 
            minimumFractionDigits: 0,
            maximumFractionDigits: 0 
          })}
        </div>
      </td>

      {/* 7. Empaquetados - 12% */}
      <td className="px-2 py-3">
        <div className="text-sm font-medium text-gray-900">
          {product.packagedUnits} emp
        </div>
      </td>
      
      {/* 8. Acciones - 10% */}
      <td className="px-2 py-3">
        <div className="flex items-center justify-center space-x-1">
          <button 
            onClick={handleView}
            className="text-blue-600 hover:text-blue-800 p-1.5 rounded hover:bg-blue-50 transition-all duration-200" 
            title="Ver detalles"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button 
            onClick={handleEdit}
            className="text-green-600 hover:text-green-800 p-1.5 rounded hover:bg-green-50 transition-all duration-200" 
            title="Editar"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button 
            onClick={handleDelete}
            className="text-red-600 hover:text-red-800 p-1.5 rounded hover:bg-red-50 transition-all duration-200"
            title="Eliminar"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ProductTableRow;
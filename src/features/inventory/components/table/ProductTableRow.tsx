// table/ProductTableRow.tsx - VERSIÓN MEJORADA
import React from "react";
import { Eye, Edit3, Trash2, AlertTriangle, Clock } from "lucide-react";
import type { ProductWithCalculatedData, StockStatus } from "../../types";

interface ProductTableRowProps {
  product: ProductWithCalculatedData;
  onDelete: (id: number) => void;
  onEdit?: (product: ProductWithCalculatedData) => void;
  onView?: (product: ProductWithCalculatedData) => void;
}

const ProductTableRow: React.FC<ProductTableRowProps> = ({ 
  product, 
  onDelete, 
  onEdit, 
  onView 
}) => {
  // Función para obtener color del estado del producto
  const getStateColor = (state: string, estimatedDays: number) => {
    if (state === 'vencido' || estimatedDays <= 0) return 'bg-red-100 text-red-800 border-red-200';
    if (state === 'por-vencer' || estimatedDays <= 3) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    if (state === 'congelado') return 'bg-blue-100 text-blue-800 border-blue-200';
    return 'bg-green-100 text-green-800 border-green-200';
  };

  // Función para obtener texto del estado
  const getStateText = (state: string, estimatedDays: number) => {
    if (state === 'vencido' || estimatedDays <= 0) return 'Vencido';
    if (state === 'por-vencer' || estimatedDays <= 3) return 'Por Vencer';
    if (state === 'congelado') return 'Congelado';
    return 'Fresco';
  };

  // Función para obtener color del estado de stock
  const getStockStatusColor = (status: StockStatus) => {
    switch (status) {
      case 'Sin Stock': return 'bg-red-100 text-red-800 border-red-200';
      case 'Stock Bajo': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Reponer Pronto': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Stock OK': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Función para obtener icono de urgencia
  const getUrgencyIcon = () => {
    const isLowStock = ['Sin Stock', 'Stock Bajo'].includes(product.stockStatus);
    const isExpiring = product.estimatedDaysToExpiry <= 3 || product.state === 'por-vencer';
    const isExpired = product.estimatedDaysToExpiry <= 0 || product.state === 'vencido';

    if (isExpired) return <AlertTriangle className="w-4 h-4 text-red-500" />;
    if (isExpiring || isLowStock) return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    if (product.estimatedDaysToExpiry <= 7) return <Clock className="w-4 h-4 text-blue-500" />;
    return null;
  };

  // Función para obtener clase de la fila según urgencia
  const getRowClassName = () => {
    const isExpired = product.estimatedDaysToExpiry <= 0 || product.state === 'vencido';
    const isUrgent = product.stockStatus === 'Sin Stock' || product.estimatedDaysToExpiry <= 1;
    const isWarning = product.stockStatus === 'Stock Bajo' || product.estimatedDaysToExpiry <= 3;

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

  return (
    <tr className={getRowClassName()}>
      {/* Producto */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center space-x-3">
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <div className="text-sm font-medium text-gray-900">{product.name}</div>
              {getUrgencyIcon()}
            </div>
            <div className="text-xs text-gray-500 mt-1">{product.supplier}</div>
          </div>
        </div>
      </td>
      
      {/* Categoría */}
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
          {product.category}
        </span>
      </td>
      
      {/* Unidad */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900 font-medium">{product.unit}</div>
        <div className="text-xs text-gray-500">Mín: {product.minStock}</div>
      </td>
      
      {/* Cantidad */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-semibold text-gray-900">
          {product.quantity.toLocaleString('es-PE')}
        </div>
        <div className="text-xs text-gray-500">{product.unit}</div>
      </td>

      {/* Estado Stock */}
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
          getStockStatusColor(product.stockStatus)
        }`}>
          {product.stockStatus}
        </span>
      </td>
      
      {/* Precio Unitario */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">
          S/ {product.price.toLocaleString("es-PE", { 
            minimumFractionDigits: 2,
            maximumFractionDigits: 2 
          })}
        </div>
        <div className="text-xs text-gray-500">por {product.unit}</div>
      </td>

      {/* Total */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-semibold text-gray-900">
          S/ {product.totalValue.toLocaleString("es-PE", { 
            minimumFractionDigits: 2,
            maximumFractionDigits: 2 
          })}
        </div>
        <div className="text-xs text-gray-500">
          {product.quantity} × S/ {product.price.toFixed(2)}
        </div>
      </td>
      
      {/* Días para Vencimiento */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className={`text-sm font-medium ${
          product.estimatedDaysToExpiry <= 0 ? 'text-red-600' : 
          product.estimatedDaysToExpiry <= 3 ? 'text-yellow-600' : 
          product.estimatedDaysToExpiry <= 7 ? 'text-blue-600' :
          'text-gray-900'
        }`}>
          {product.estimatedDaysToExpiry <= 0 ? '¡VENCIDO!' : `${product.estimatedDaysToExpiry} días`}
        </div>
        <div className={`text-xs ${
          product.estimatedDaysToExpiry <= 0 ? 'text-red-600' : 
          product.estimatedDaysToExpiry <= 3 ? 'text-yellow-600' : 
          'text-gray-500'
        }`}>
          {product.estimatedDaysToExpiry <= 0 ? 'Revisar inmediatamente' :
           product.estimatedDaysToExpiry <= 1 ? 'Vence mañana' :
           product.estimatedDaysToExpiry <= 3 ? 'Próximo a vencer' :
           product.estimatedDaysToExpiry <= 7 ? 'Vence esta semana' :
           'En buen estado'}
        </div>
      </td>
      
      {/* Estado del Producto */}
      {/* <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
          getStateColor(product.state, product.estimatedDaysToExpiry)
        }`}>
          {getStateText(product.state, product.estimatedDaysToExpiry)}
        </span>
      </td>
       */}
      {/* Acciones */}
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex items-center space-x-1">
          <button 
            onClick={handleView}
            className="text-blue-600 hover:text-blue-800 p-2 rounded-md hover:bg-blue-50 transition-all duration-200 group" 
            title="Ver detalles del producto"
          >
            <Eye className="w-4 h-4 group-hover:scale-110 transition-transform" />
          </button>
          <button 
            onClick={handleEdit}
            className="text-green-600 hover:text-green-800 p-2 rounded-md hover:bg-green-50 transition-all duration-200 group" 
            title="Editar producto"
          >
            <Edit3 className="w-4 h-4 group-hover:scale-110 transition-transform" />
          </button>
          <button 
            onClick={handleDelete}
            className="text-red-600 hover:text-red-800 p-2 rounded-md hover:bg-red-50 transition-all duration-200 group"
            title="Eliminar producto"
          >
            <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ProductTableRow;
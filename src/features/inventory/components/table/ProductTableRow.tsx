import React from "react";
import { Eye, Edit3, Trash2, AlertTriangle } from "lucide-react";
import type { Product } from "../../types";

interface ProductTableRowProps {
  product: Product;
  onDelete: (id: number) => void;
}

const ProductTableRow: React.FC<ProductTableRowProps> = ({ product, onDelete }) => {
  // Función para obtener color del estado
  const getStateColor = (state: string, quantity: number, minStock: number) => {
    if (state === 'vencido') return 'bg-red-100 text-red-800';
    if (state === 'por-vencer') return 'bg-yellow-100 text-yellow-800';
    if (quantity <= minStock) return 'bg-orange-100 text-orange-800';
    if (state === 'congelado') return 'bg-blue-100 text-blue-800';
    return 'bg-green-100 text-green-800';
  };

  // Función para obtener texto del estado
  const getStateText = (state: string, quantity: number, minStock: number) => {
    if (state === 'vencido') return 'Vencido';
    if (state === 'por-vencer') return 'Por Vencer';
    if (quantity <= minStock) return 'Stock Bajo';
    if (state === 'congelado') return 'Congelado';
    return 'Fresco';
  };

  // Función para calcular días hasta vencimiento
  const getDaysUntilExpiry = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleDelete = () => {
    const confirmed = window.confirm('¿Estás seguro de eliminar este producto del inventario?');
    if (confirmed) {
      onDelete(product.id);
    }
  };

  const daysUntilExpiry = getDaysUntilExpiry(product.expiryDate);

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      {/* Producto */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div>
            <div className="text-sm font-medium text-gray-900">{product.name}</div>
            <div className="text-xs text-gray-500">{product.supplier}</div>
          </div>
          {(product.state === 'vencido' || product.state === 'por-vencer') && (
            <AlertTriangle className="w-4 h-4 text-yellow-500 ml-2" />
          )}
        </div>
      </td>
      
      {/* Categoría */}
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {product.category}
        </span>
      </td>
      
      {/* Cantidad */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          {product.quantity} {product.unit}
        </div>
        <div className="text-xs text-gray-500">Mín: {product.minStock} {product.unit}</div>
      </td>
      
      {/* Precio */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">
          S/ {product.price.toLocaleString("es-PE", { minimumFractionDigits: 2 })}
        </div>
        <div className="text-xs text-gray-500">
          Total: S/ {(product.quantity * product.price).toLocaleString("es-PE", { minimumFractionDigits: 2 })}
        </div>
      </td>
      
      {/* TEMPORALMENTE OCULTO - COLUMNA DE CONTENEDORES */}
      {/*
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
          {product.container}
        </span>
      </td>
      */}
      
      {/* Vencimiento */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          {new Date(product.expiryDate).toLocaleDateString('es-PE')}
        </div>
        <div className={`text-xs ${
          daysUntilExpiry < 0 ? 'text-red-600' : 
          daysUntilExpiry <= 3 ? 'text-yellow-600' : 
          'text-gray-500'
        }`}>
          {daysUntilExpiry < 0 ? `Vencido hace ${Math.abs(daysUntilExpiry)} días` :
           daysUntilExpiry === 0 ? 'Vence hoy' :
           `${daysUntilExpiry} días restantes`}
        </div>
      </td>
      
      {/* Estado */}
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          getStateColor(product.state, product.quantity, product.minStock)
        }`}>
          {getStateText(product.state, product.quantity, product.minStock)}
        </span>
      </td>
      
      {/* Acciones */}
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex space-x-2">
          <button 
            className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50 transition-colors" 
            title="Ver detalles"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button 
            className="text-green-600 hover:text-green-800 p-1 rounded hover:bg-green-50 transition-colors" 
            title="Editar"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button 
            onClick={handleDelete}
            className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 transition-colors"
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
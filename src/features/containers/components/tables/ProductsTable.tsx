// src/features/containers/components/tables/ProductsTable.tsx

import React from 'react';
import { 
  Package, 
  Edit, 
  Trash2, 
  Calendar, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Snowflake 
} from 'lucide-react';
import type { ContainerProduct } from '../../types/container.types';

interface ProductsTableProps {
  products: ContainerProduct[];
  onEdit: (productId: string) => void;
  onDelete: (productId: string) => void;
}

const ProductsTable: React.FC<ProductsTableProps> = ({
  products,
  onEdit,
  onDelete
}) => {
  const getStateIcon = (state: string) => {
    switch (state) {
      case 'fresco':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'congelado':
        return <Snowflake className="w-4 h-4 text-blue-500" />;
      case 'por_vencer':
        return <Clock className="w-4 h-4 text-orange-500" />;
      case 'vencido':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Package className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStateBadge = (state: string) => {
    const badges = {
      fresco: 'bg-green-100 text-green-800',
      congelado: 'bg-blue-100 text-blue-800',
      por_vencer: 'bg-orange-100 text-orange-800',
      vencido: 'bg-red-100 text-red-800',
    };
    return badges[state as keyof typeof badges] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const calculateDaysToExpiry = (dateString: string) => {
    const now = new Date();
    const expiryDate = new Date(dateString);
    const diffTime = expiryDate.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getStateDisplayName = (state: string) => {
    const stateNames = {
      fresco: 'Fresco',
      congelado: 'Congelado',
      por_vencer: 'Por vencer',
      vencido: 'Vencido'
    };
    return stateNames[state as keyof typeof stateNames] || state;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Producto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categoría
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cantidad
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Empaquetado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vencimiento
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Precio
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Package className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {product.producto_nombre}
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: {product.producto_id}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {product.categoria}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {product.cantidad} {product.unidad_medida}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div>
                    <span className="font-medium">{product.empaquetado || 'N/A'}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Individual
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {product.fecha_vencimiento ? (
                    <div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>{formatDate(product.fecha_vencimiento)}</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {(() => {
                          const days = calculateDaysToExpiry(product.fecha_vencimiento);
                          if (days < 0) return `Vencido hace ${Math.abs(days)} días`;
                          if (days === 0) return 'Vence hoy';
                          return `${days} días restantes`;
                        })()}
                      </div>
                    </div>
                  ) : (
                    <span className="text-gray-400">Sin fecha</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    {getStateIcon(product.estado_calculado)}
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStateBadge(product.estado_calculado)}`}>
                      {getStateDisplayName(product.estado_calculado)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div>
                    <span className="font-medium">S/ {(product.precio_real_unidad || 0).toFixed(2)}</span>
                    <div className="text-xs text-gray-500">por {product.unidad_medida}</div>
                  </div>
                  <div className="text-xs text-green-600 font-medium">
                    Total: S/ {product.valor_total.toFixed(2)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => onEdit(product.id)}
                      className="text-blue-600 hover:text-blue-900 p-1"
                      title="Editar producto"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(product.id)}
                      className="text-red-600 hover:text-red-900 p-1"
                      title="Eliminar producto"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductsTable;
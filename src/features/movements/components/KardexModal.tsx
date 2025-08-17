// src/features/movements/components/KardexModal.tsx

import React from 'react';
import { X, Package, TrendingUp, TrendingDown, RotateCcw, Download } from 'lucide-react';
import type { KardexEntry } from '../types/movement.types';

interface KardexModalProps {
  productId: string;
  onClose: () => void;
}

const KardexModal: React.FC<KardexModalProps> = ({ productId, onClose }) => {
  // Mock data - En tu app real, esto vendría de tu API basado en productId
  const product = {
    id: productId,
    name: 'Lenguado Filetes',
    code: 'LF001',
    currentStock: 15,
    unitPrice: 28.50,
  };

  const kardexEntries: KardexEntry[] = [
    {
      id: '1',
      productId: productId,
      productName: product.name,
      type: 'entrada',
      quantity: 20,
      previousStock: 0,
      newStock: 20,
      runningBalance: 20,
      unitPrice: 28.50,
      totalValue: 570.00,
      reason: 'Compra inicial de inventario',
      documentNumber: 'FAC-001-001',
      createdBy: 'admin',
      createdAt: new Date('2024-08-01T10:00:00'),
    },
    {
      id: '2',
      productId: productId,
      productName: product.name,
      type: 'salida',
      quantity: 5,
      previousStock: 20,
      newStock: 15,
      runningBalance: 15,
      unitPrice: 28.50,
      totalValue: 142.50,
      reason: 'Venta a cliente',
      documentNumber: 'BOL-001-001',
      createdBy: 'admin',
      createdAt: new Date('2024-08-02T14:30:00'),
    },
    {
      id: '3',
      productId: productId,
      productName: product.name,
      type: 'ajuste',
      quantity: 2,
      previousStock: 15,
      newStock: 17,
      runningBalance: 17,
      reason: 'Ajuste por inventario físico',
      createdBy: 'admin',
      createdAt: new Date('2024-08-03T09:15:00'),
    },
    {
      id: '4',
      productId: productId,
      productName: product.name,
      type: 'salida',
      quantity: 2,
      previousStock: 17,
      newStock: 15,
      runningBalance: 15,
      unitPrice: 28.50,
      totalValue: 57.00,
      reason: 'Venta mostrador',
      createdBy: 'admin',
      createdAt: new Date('2024-08-04T16:45:00'),
    },
  ];

  const getMovementIcon = (type: KardexEntry['type']) => {
    switch (type) {
      case 'entrada':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'salida':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      case 'ajuste':
        return <RotateCcw className="w-4 h-4 text-yellow-600" />;
      default:
        return null;
    }
  };

  const getMovementTypeClass = (type: KardexEntry['type']) => {
    switch (type) {
      case 'entrada':
        return 'bg-green-100 text-green-800';
      case 'salida':
        return 'bg-red-100 text-red-800';
      case 'ajuste':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getMovementTypeName = (type: KardexEntry['type']) => {
    switch (type) {
      case 'entrada':
        return 'Entrada';
      case 'salida':
        return 'Salida';
      case 'ajuste':
        return 'Ajuste';
      default:
        return type;
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
    }).format(amount);
  };

  const totalEntradas = kardexEntries
    .filter(entry => entry.type === 'entrada')
    .reduce((sum, entry) => sum + entry.quantity, 0);

  const totalSalidas = kardexEntries
    .filter(entry => entry.type === 'salida')
    .reduce((sum, entry) => sum + entry.quantity, 0);

  const totalAjustes = kardexEntries
    .filter(entry => entry.type === 'ajuste')
    .reduce((sum, entry) => sum + entry.quantity, 0);

  const handleExportKardex = () => {
    // Aquí implementarías la exportación a Excel/PDF
    console.log('Exportando kardex del producto:', product.name);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Kardex - {product.name}
              </h2>
              <p className="text-sm text-gray-600">
                Código: {product.code} • Stock Actual: {product.currentStock} unidades
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handleExportKardex}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Exportar</span>
            </button>
            
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="p-6 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Total Entradas</p>
                  <p className="text-2xl font-semibold text-gray-900">{totalEntradas}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <TrendingDown className="w-5 h-5 text-red-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Total Salidas</p>
                  <p className="text-2xl font-semibold text-gray-900">{totalSalidas}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <RotateCcw className="w-5 h-5 text-yellow-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Total Ajustes</p>
                  <p className="text-2xl font-semibold text-gray-900">{totalAjustes}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Package className="w-5 h-5 text-blue-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Stock Actual</p>
                  <p className="text-2xl font-semibold text-gray-900">{product.currentStock}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Kardex Table */}
        <div className="flex-1 overflow-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Entrada
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Salida
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Saldo
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  P. Unit.
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Motivo
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {kardexEntries.map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(entry.createdAt)}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getMovementIcon(entry.type)}
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getMovementTypeClass(entry.type)}`}>
                        {getMovementTypeName(entry.type)}
                      </span>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                    {entry.type === 'entrada' || (entry.type === 'ajuste' && entry.quantity > 0) ? (
                      <span className="text-green-600 font-medium">
                        +{entry.quantity}
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                    {entry.type === 'salida' || (entry.type === 'ajuste' && entry.quantity < 0) ? (
                      <span className="text-red-600 font-medium">
                        -{Math.abs(entry.quantity)}
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-semibold text-gray-900">
                    {entry.runningBalance}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                    {entry.unitPrice ? formatCurrency(entry.unitPrice) : '-'}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                    {entry.totalValue ? formatCurrency(entry.totalValue) : '-'}
                  </td>
                  
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="max-w-xs">
                      {entry.reason}
                      {entry.documentNumber && (
                        <div className="text-xs text-gray-500 mt-1">
                          Doc: {entry.documentNumber}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Mostrando {kardexEntries.length} movimiento{kardexEntries.length !== 1 ? 's' : ''} 
              para {product.name}
            </div>
            
            <div className="text-sm text-gray-600">
              Última actualización: {formatDate(new Date())}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KardexModal;
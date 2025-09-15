// src/features/containers/components/views/ContainerDetailView.tsx

import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Package,
  Thermometer,
  RefreshCw,
  Timer
} from 'lucide-react';
import { InventoryProductsService } from '../../services/InventoryProductsService';
import type { ContainerProductWithExpiration } from '../../services/InventoryProductsService';

interface ContainerDetailViewProps {
  containerId: string;
  containerName: string;
}

const ContainerDetailView: React.FC<ContainerDetailViewProps> = ({
  containerId,
  containerName
}) => {
  const [products, setProducts] = useState<ContainerProductWithExpiration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadContainerProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Actualizar estados automáticamente antes de cargar
      await InventoryProductsService.updateProductStatesBasedOnExpiration();
      
      // Cargar productos con información de vencimiento
      const containerProducts = await InventoryProductsService.getContainerProductsWithExpiration(containerId);
      setProducts(containerProducts);
    } catch (err) {
      console.error('Error cargando productos del contenedor:', err);
      setError('Error al cargar los productos del contenedor');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContainerProducts();
  }, [containerId]);

  const getStateIcon = (estado: string, diasParaVencer: number | null) => {
    if (diasParaVencer !== null && diasParaVencer < 0) {
      return <XCircle className="w-5 h-5 text-red-500" />;
    } else if (diasParaVencer !== null && diasParaVencer <= 3) {
      return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    } else if (estado.toLowerCase().includes('fresco')) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    } else if (estado.toLowerCase().includes('congelado')) {
      return <Thermometer className="w-5 h-5 text-blue-500" />;
    }
    return <Package className="w-5 h-5 text-gray-500" />;
  };

  const getStateColor = (diasParaVencer: number | null, estado: string) => {
    if (diasParaVencer !== null && diasParaVencer < 0) {
      return 'bg-red-50 text-red-700 border-red-200';
    } else if (diasParaVencer !== null && diasParaVencer <= 3) {
      return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    } else if (estado.toLowerCase().includes('fresco')) {
      return 'bg-green-50 text-green-700 border-green-200';
    } else if (estado.toLowerCase().includes('congelado')) {
      return 'bg-blue-50 text-blue-700 border-blue-200';
    }
    return 'bg-gray-50 text-gray-700 border-gray-200';
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Sin fecha';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getExpirationStatus = (product: ContainerProductWithExpiration) => {
    if (!product.fecha_vencimiento) {
      return {
        text: 'Sin fecha de vencimiento',
        color: 'text-gray-500',
        icon: Calendar
      };
    }

    const diasParaVencer = product.dias_para_vencer;
    if (diasParaVencer === null) return null;

    if (diasParaVencer < 0) {
      const diasVencido = Math.abs(diasParaVencer);
      return {
        text: `Vencido hace ${diasVencido} día${diasVencido !== 1 ? 's' : ''}`,
        color: 'text-red-600',
        icon: XCircle
      };
    } else if (diasParaVencer === 0) {
      return {
        text: 'Vence hoy',
        color: 'text-red-600',
        icon: AlertTriangle
      };
    } else if (diasParaVencer <= 3) {
      return {
        text: `Vence en ${diasParaVencer} día${diasParaVencer !== 1 ? 's' : ''}`,
        color: 'text-yellow-600',
        icon: AlertTriangle
      };
    } else if (diasParaVencer <= 7) {
      return {
        text: `Vence en ${diasParaVencer} día${diasParaVencer !== 1 ? 's' : ''}`,
        color: 'text-orange-600',
        icon: Calendar
      };
    } else {
      return {
        text: `Vence en ${diasParaVencer} día${diasParaVencer !== 1 ? 's' : ''}`,
        color: 'text-green-600',
        icon: Calendar
      };
    }
  };

  const formatExpirationInfo = (product: ContainerProductWithExpiration) => {
    const status = getExpirationStatus(product);
    if (!status) return null;

    const Icon = status.icon;
    const fechaVencimiento = formatDate(product.fecha_vencimiento);

    return (
      <div className="space-y-2">
        <div className={`text-sm font-medium ${status.color}`}>
          <Icon className="w-4 h-4 inline mr-1" />
          {status.text}
        </div>
        {product.fecha_vencimiento && (
          <div className="text-xs text-gray-500">
            Fecha de vencimiento: {fechaVencimiento}
          </div>
        )}
        <div className="text-xs text-gray-500 flex items-center">
          <Timer className="w-3 h-3 inline mr-1" />
          Almacenado: {product.dias_almacenado} día{product.dias_almacenado !== 1 ? 's' : ''}
        </div>
      </div>
    );
  };

  const getTotalValue = () => {
    return products.reduce((total, product) => total + product.valor_total, 0);
  };

  const getProductStats = () => {
    const vencidos = products.filter(p => p.dias_para_vencer !== null && p.dias_para_vencer < 0).length;
    const porVencer = products.filter(p => p.dias_para_vencer !== null && p.dias_para_vencer >= 0 && p.dias_para_vencer <= 3).length;
    const frescos = products.filter(p => p.estado.toLowerCase().includes('fresco')).length;
    const congelados = products.filter(p => p.estado.toLowerCase().includes('congelado')).length;
    
    return { vencidos, porVencer, frescos, congelados };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-700">Cargando productos del contenedor...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <XCircle className="w-5 h-5 text-red-500 mr-2" />
          <span className="text-red-700">{error}</span>
        </div>
      </div>
    );
  }

  const stats = getProductStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Productos en {containerName}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {products.length} producto{products.length !== 1 ? 's' : ''} • Valor total: S/. {getTotalValue().toFixed(2)}
          </p>
        </div>
        <button
          onClick={loadContainerProducts}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Actualizar
        </button>
      </div>

      {/* Stats Summary */}
      {products.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.vencidos > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center">
                <XCircle className="w-5 h-5 text-red-500 mr-2" />
                <div>
                  <p className="text-sm font-medium text-red-900">{stats.vencidos}</p>
                  <p className="text-xs text-red-700">Vencidos</p>
                </div>
              </div>
            </div>
          )}
          {stats.porVencer > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 text-yellow-500 mr-2" />
                <div>
                  <p className="text-sm font-medium text-yellow-900">{stats.porVencer}</p>
                  <p className="text-xs text-yellow-700">Por vencer</p>
                </div>
              </div>
            </div>
          )}
          {stats.frescos > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                <div>
                  <p className="text-sm font-medium text-green-900">{stats.frescos}</p>
                  <p className="text-xs text-green-700">Frescos</p>
                </div>
              </div>
            </div>
          )}
          {stats.congelados > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center">
                <Thermometer className="w-5 h-5 text-blue-500 mr-2" />
                <div>
                  <p className="text-sm font-medium text-blue-900">{stats.congelados}</p>
                  <p className="text-xs text-blue-700">Congelados</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">No hay productos en este contenedor</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className={`border rounded-lg p-4 ${getStateColor(product.dias_para_vencer, product.estado)}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{product.nombre}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                      {product.estado}
                    </span>
                  </div>
                </div>
                {getStateIcon(product.estado, product.dias_para_vencer)}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Cantidad:</span>
                  <span className="font-medium">{product.cantidad}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Precio unitario:</span>
                  <span className="font-medium">S/. {product.precio_real_unidad.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Valor total:</span>
                  <span className="font-medium">S/. {product.valor_total.toFixed(2)}</span>
                </div>

                {product.empaquetado && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Empaquetado:</span>
                    <span className="font-medium">{product.empaquetado}</span>
                  </div>
                )}

                <div className="pt-2 border-t">
                  {formatExpirationInfo(product)}
                </div>

                <div className="text-xs text-gray-500">
                  <Clock className="w-3 h-3 inline mr-1" />
                  Ingresado: {formatDate(product.fecha_ingreso)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContainerDetailView;
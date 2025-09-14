// src/features/movements/hooks/useKardexData.ts
// HOOK ACTUALIZADO CON DATOS REALES DE BD

import { useState, useEffect } from 'react';
import { KardexService } from '../services/KardexService';
import type { 
  KardexProduct, 
  KardexMovement, 
  KardexStats, 
  KardexDateRange 
} from '../types/kardex.types';

interface UseKardexDataReturn {
  producto: KardexProduct | null;
  movimientos: KardexMovement[];
  stats: KardexStats;
  loading: boolean;
  error: string | null;
  refrescarKardex: () => Promise<void>;
  aplicarFiltros: (filtros: KardexDateRange) => Promise<void>;
}

export const useKardexData = (productId: string): UseKardexDataReturn => {
  const [producto, setProducto] = useState<KardexProduct | null>(null);
  const [movimientos, setMovimientos] = useState<KardexMovement[]>([]);
  const [stats, setStats] = useState<KardexStats>({
    total_entradas: 0,
    total_salidas: 0,
    total_ajustes: 0,
    cantidad_entradas: 0,
    cantidad_salidas: 0,
    cantidad_ajustes: 0,
    valor_total_entradas: 0,
    valor_total_salidas: 0,
    movimientos_periodo: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtrosActuales, setFiltrosActuales] = useState<KardexDateRange>({});

  // Cargar datos del kardex
  const cargarKardex = async (filtros?: KardexDateRange) => {
    try {
      setLoading(true);
      setError(null);

      const kardexData = await KardexService.getKardexCompleto(productId, filtros);

      if (!kardexData.producto) {
        throw new Error('Producto no encontrado');
      }

      setProducto(kardexData.producto);
      setMovimientos(kardexData.movimientos);
      setStats(kardexData.stats);
    } catch (err) {
      console.error('Error cargando kardex:', err);
      setError('Error al cargar el kardex del producto');
    } finally {
      setLoading(false);
    }
  };

  // Refrescar kardex con filtros actuales
  const refrescarKardex = async () => {
    await cargarKardex(filtrosActuales);
  };

  // Aplicar nuevos filtros
  const aplicarFiltros = async (filtros: KardexDateRange) => {
    setFiltrosActuales(filtros);
    await cargarKardex(filtros);
  };

  // Cargar datos iniciales
  useEffect(() => {
    if (productId) {
      cargarKardex();
    }
  }, [productId]);

  return {
    producto,
    movimientos,
    stats,
    loading,
    error,
    refrescarKardex,
    aplicarFiltros
  };
};
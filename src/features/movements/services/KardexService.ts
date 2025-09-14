// src/features/movements/services/KardexService.ts
// SERVICIO PARA KARDEX CON DATOS REALES DE BD - ERRORES CORREGIDOS

import { supabase } from '../../../lib/supabase';
import type { 
  KardexProduct, 
  KardexMovement, 
  KardexStats, 
  KardexDateRange 
} from '../types/kardex.types';

export class KardexService {
  
  // ============================================
  // OBTENER DATOS DEL PRODUCTO PARA KARDEX
  // ============================================
  static async getProductoKardex(productoId: string): Promise<KardexProduct | null> {
    try {
      const { data: producto, error } = await supabase
        .from('productos')
        .select(`
          id,
          codigo,
          nombre,
          precio_estimado,
          stock_min,
          categoria:categorias!inner(nombre),
          unidad_medida:unidades_medida!inner(abreviatura)
        `)
        .eq('id', productoId)
        .eq('visible', true)
        .single();

      if (error) throw error;
      if (!producto) return null;

      // Calcular stock actual desde detalle_contenedor
      const { data: detalles } = await supabase
        .from('detalle_contenedor')
        .select('cantidad')
        .eq('producto_id', productoId)
        .eq('visible', true);

      const stock_actual = detalles?.reduce((sum, d) => sum + (d.cantidad || 0), 0) || 0;

      return {
        id: producto.id,
        nombre: producto.nombre,
        codigo: producto.codigo,
        categoria: (producto.categoria as any)?.nombre || 'Sin categoría',
        unidad_medida: (producto.unidad_medida as any)?.abreviatura || 'und',
        stock_actual,
        precio_estimado: producto.precio_estimado || 0,
        stock_min: producto.stock_min || 0
      };
    } catch (error) {
      console.error('Error obteniendo producto para kardex:', error);
      return null;
    }
  }

  // ============================================
  // OBTENER MOVIMIENTOS KARDEX
  // ============================================
  static async getMovimientosKardex(
    productoId: string, 
    filtros?: KardexDateRange
  ): Promise<KardexMovement[]> {
    try {
      let query = supabase
        .from('movimientos')
        .select(`
          id,
          fecha_movimiento,
          cantidad,
          stock_anterior,
          stock_nuevo,
          precio_real,
          numero_documento,
          observacion,
          contenedor_id,
          contenedor:contenedores!inner(nombre),
          motivo:motivos_movimiento!inner(nombre, descripcion, tipo_movimiento)
        `)
        .eq('producto_id', productoId)
        .order('fecha_movimiento', { ascending: true });

      // Aplicar filtros de fecha si existen
      if (filtros?.fecha_desde) {
        query = query.gte('fecha_movimiento', filtros.fecha_desde);
      }
      if (filtros?.fecha_hasta) {
        query = query.lte('fecha_movimiento', filtros.fecha_hasta);
      }

      const { data: movimientos, error } = await query;

      if (error) throw error;
      if (!movimientos) return [];

      // Obtener empaquetado para entradas
      const movimientosConEmpaquetado = await Promise.all(
        movimientos.map(async (mov: any) => {
          let empaquetado = null;
          
          // Solo buscar empaquetado para entradas
          if (mov.motivo?.tipo_movimiento === 'entrada') {
            const { data: detalle } = await supabase
              .from('detalle_contenedor')
              .select('empaquetado')
              .eq('producto_id', productoId)
              .eq('contenedor_id', mov.contenedor_id)
              .gte('created_at', mov.fecha_movimiento)
              .order('created_at', { ascending: true })
              .limit(1)
              .maybeSingle();
            
            empaquetado = detalle?.empaquetado;
          }

          return {
            id: mov.id,
            fecha_movimiento: mov.fecha_movimiento,
            tipo_movimiento: mov.motivo?.tipo_movimiento || 'entrada',
            cantidad: mov.cantidad,
            stock_anterior: mov.stock_anterior,
            stock_nuevo: mov.stock_nuevo,
            precio_real: mov.precio_real,
            numero_documento: mov.numero_documento,
            observacion: mov.observacion,
            empaquetado,
            contenedor_nombre: mov.contenedor?.nombre || 'Sin contenedor',
            motivo_nombre: mov.motivo?.nombre || 'Sin motivo',
            motivo_descripcion: mov.motivo?.descripcion,
            saldo_corriente: mov.stock_nuevo, // El saldo es el stock nuevo
            valor_total: (mov.cantidad || 0) * (mov.precio_real || 0)
          } as KardexMovement;
        })
      );

      return movimientosConEmpaquetado;
    } catch (error) {
      console.error('Error obteniendo movimientos kardex:', error);
      return [];
    }
  }

  // ============================================
  // CALCULAR ESTADÍSTICAS KARDEX
  // ============================================
  static async getStatsKardex(
    productoId: string, 
    filtros?: KardexDateRange
  ): Promise<KardexStats> {
    try {
      let query = supabase
        .from('movimientos')
        .select(`
          cantidad,
          precio_real,
          motivo:motivos_movimiento!inner(tipo_movimiento)
        `)
        .eq('producto_id', productoId);

      // Aplicar filtros de fecha si existen
      if (filtros?.fecha_desde) {
        query = query.gte('fecha_movimiento', filtros.fecha_desde);
      }
      if (filtros?.fecha_hasta) {
        query = query.lte('fecha_movimiento', filtros.fecha_hasta);
      }

      const { data: movimientos, error } = await query;

      if (error) throw error;
      if (!movimientos) {
        return {
          total_entradas: 0,
          total_salidas: 0,
          total_ajustes: 0,
          cantidad_entradas: 0,
          cantidad_salidas: 0,
          cantidad_ajustes: 0,
          valor_total_entradas: 0,
          valor_total_salidas: 0,
          movimientos_periodo: 0
        };
      }

      const entradas = movimientos.filter((m: any) => m.motivo?.tipo_movimiento === 'entrada');
      const salidas = movimientos.filter((m: any) => m.motivo?.tipo_movimiento === 'salida');
      const ajustes = movimientos.filter((m: any) => m.motivo?.tipo_movimiento === 'ajuste');

      const stats: KardexStats = {
        total_entradas: entradas.length,
        total_salidas: salidas.length,
        total_ajustes: ajustes.length,
        cantidad_entradas: entradas.reduce((sum: number, m: any) => sum + (m.cantidad || 0), 0),
        cantidad_salidas: salidas.reduce((sum: number, m: any) => sum + (m.cantidad || 0), 0),
        cantidad_ajustes: ajustes.reduce((sum: number, m: any) => sum + (m.cantidad || 0), 0),
        valor_total_entradas: entradas.reduce((sum: number, m: any) => sum + ((m.cantidad || 0) * (m.precio_real || 0)), 0),
        valor_total_salidas: salidas.reduce((sum: number, m: any) => sum + ((m.cantidad || 0) * (m.precio_real || 0)), 0),
        movimientos_periodo: movimientos.length
      };

      return stats;
    } catch (error) {
      console.error('Error calculando estadísticas kardex:', error);
      return {
        total_entradas: 0,
        total_salidas: 0,
        total_ajustes: 0,
        cantidad_entradas: 0,
        cantidad_salidas: 0,
        cantidad_ajustes: 0,
        valor_total_entradas: 0,
        valor_total_salidas: 0,
        movimientos_periodo: 0
      };
    }
  }

  // ============================================
  // OBTENER KARDEX COMPLETO
  // ============================================
  static async getKardexCompleto(
    productoId: string, 
    filtros?: KardexDateRange
  ) {
    try {
      const [producto, movimientos, stats] = await Promise.all([
        this.getProductoKardex(productoId),
        this.getMovimientosKardex(productoId, filtros),
        this.getStatsKardex(productoId, filtros)
      ]);

      return {
        producto,
        movimientos,
        stats
      };
    } catch (error) {
      console.error('Error obteniendo kardex completo:', error);
      throw error;
    }
  }
}
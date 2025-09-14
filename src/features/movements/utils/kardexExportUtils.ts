// src/features/movements/utils/kardexExportUtils.ts
// UTILIDADES PARA EXPORTAR KARDEX A EXCEL

import * as XLSX from 'xlsx';
import type { KardexProduct, KardexMovement, KardexStats } from '../types/kardex.types';

interface KardexExportData {
  producto: KardexProduct;
  movimientos: KardexMovement[];
  stats: KardexStats;
  filtros?: {
    fecha_desde?: string;
    fecha_hasta?: string;
  };
}

export class KardexExportUtils {
  
  // ============================================
  // EXPORTAR KARDEX A EXCEL
  // ============================================
  static exportToExcel(data: KardexExportData): void {
    const { producto, movimientos, stats, filtros } = data;
    
    // Crear nuevo workbook
    const workbook = XLSX.utils.book_new();
    
    // 1. Hoja de información del producto
    const infoData = this.createProductInfoSheet(producto, stats, filtros);
    const infoSheet = XLSX.utils.aoa_to_sheet(infoData);
    
    // 2. Hoja de movimientos (kardex)
    const movimientosData = this.createMovimientosSheet(movimientos);
    const movimientosSheet = XLSX.utils.aoa_to_sheet(movimientosData);
    
    // 3. Hoja de resumen estadístico
    const statsData = this.createStatsSheet(stats, producto.unidad_medida);
    const statsSheet = XLSX.utils.aoa_to_sheet(statsData);
    
    // Configurar anchos de columnas
    this.setColumnWidths(infoSheet, [20, 30, 15]);
    this.setColumnWidths(movimientosSheet, [12, 12, 10, 10, 10, 12, 12, 25]);
    this.setColumnWidths(statsSheet, [20, 15, 15]);
    
    // Agregar hojas al workbook
    XLSX.utils.book_append_sheet(workbook, infoSheet, 'Información');
    XLSX.utils.book_append_sheet(workbook, movimientosSheet, 'Kardex');
    XLSX.utils.book_append_sheet(workbook, statsSheet, 'Resumen');
    
    // Generar nombre del archivo
    const fileName = this.generateFileName(producto);
    
    // Descargar archivo
    XLSX.writeFile(workbook, fileName);
  }
  
  // ============================================
  // CREAR HOJA DE INFORMACIÓN DEL PRODUCTO
  // ============================================
  private static createProductInfoSheet(
    producto: KardexProduct, 
    stats: KardexStats,
    filtros?: { fecha_desde?: string; fecha_hasta?: string }
  ): any[][] {
    const now = new Date();
    const fechaReporte = now.toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    return [
      // Encabezado
      ['REPORTE KARDEX DE PRODUCTO', '', ''],
      ['', '', ''],
      
      // Información del producto
      ['Producto:', producto.nombre, ''],
      ['Código:', producto.codigo || 'Sin código', ''],
      ['Categoría:', producto.categoria, ''],
      ['Unidad de Medida:', producto.unidad_medida, ''],
      ['Stock Actual:', producto.stock_actual, producto.unidad_medida],
      ['Stock Mínimo:', producto.stock_min, producto.unidad_medida],
      ['Precio Estimado:', `S/ ${producto.precio_estimado.toFixed(2)}`, ''],
      ['', '', ''],
      
      // Información del reporte
      ['Fecha del Reporte:', fechaReporte, ''],
      ['Período Consultado:', '', ''],
      filtros?.fecha_desde ? ['  Desde:', new Date(filtros.fecha_desde).toLocaleDateString('es-PE')] : ['  Desde:', 'Todos los registros'],
      filtros?.fecha_hasta ? ['  Hasta:', new Date(filtros.fecha_hasta).toLocaleDateString('es-PE')] : ['  Hasta:', 'Todos los registros'],
      ['Total de Movimientos:', stats.movimientos_periodo, ''],
      ['', '', ''],
      
      // Estado del stock
      ['ESTADO DEL STOCK', '', ''],
      producto.stock_actual <= producto.stock_min 
        ? ['Alerta:', 'STOCK BAJO', '⚠️']
        : ['Estado:', 'Stock normal', '✅']
    ];
  }
  
  // ============================================
  // CREAR HOJA DE MOVIMIENTOS
  // ============================================
  private static createMovimientosSheet(movimientos: KardexMovement[]): any[][] {
    const headers = [
      'Fecha',
      'Hora', 
      'Tipo',
      'Entrada',
      'Salida',
      'Saldo',
      'P. Unitario',
      'Valor Total',
      'Motivo',
      'Contenedor',
      'Empaquetado',
      'Documento',
      'Observación'
    ];
    
    const rows = movimientos.map(mov => {
      const fecha = new Date(mov.fecha_movimiento);
      const fechaStr = fecha.toLocaleDateString('es-PE');
      const horaStr = fecha.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
      
      return [
        fechaStr,
        horaStr,
        mov.tipo_movimiento.toUpperCase(),
        mov.tipo_movimiento === 'entrada' ? mov.cantidad : '',
        mov.tipo_movimiento === 'salida' ? mov.cantidad : '',
        mov.saldo_corriente,
        mov.precio_real ? `S/ ${mov.precio_real.toFixed(2)}` : '',
        mov.valor_total ? `S/ ${mov.valor_total.toFixed(2)}` : '',
        mov.motivo_nombre,
        mov.contenedor_nombre,
        mov.empaquetado || '',
        mov.numero_documento || '',
        mov.observacion || ''
      ];
    });
    
    return [headers, ...rows];
  }
  
  // ============================================
  // CREAR HOJA DE ESTADÍSTICAS
  // ============================================
  private static createStatsSheet(stats: KardexStats, unidad: string): any[][] {
    return [
      ['RESUMEN ESTADÍSTICO', '', ''],
      ['', '', ''],
      
      // Movimientos
      ['MOVIMIENTOS', 'Cantidad', 'Unidades'],
      ['Total Entradas', stats.total_entradas, `${stats.cantidad_entradas} ${unidad}`],
      ['Total Salidas', stats.total_salidas, `${stats.cantidad_salidas} ${unidad}`],
      ['Total Ajustes', stats.total_ajustes, `${stats.cantidad_ajustes} ${unidad}`],
      ['', '', ''],
      
      // Valores monetarios
      ['VALORES MONETARIOS', 'Monto', ''],
      ['Valor Total Entradas', `S/ ${stats.valor_total_entradas.toFixed(2)}`, ''],
      ['Valor Total Salidas', `S/ ${stats.valor_total_salidas.toFixed(2)}`, ''],
      ['Diferencia', `S/ ${(stats.valor_total_entradas - stats.valor_total_salidas).toFixed(2)}`, ''],
      ['', '', ''],
      
      // Resumen
      ['TOTALES', '', ''],
      ['Total Movimientos', stats.movimientos_periodo, ''],
      ['Diferencia Neta', `${stats.cantidad_entradas - stats.cantidad_salidas} ${unidad}`, '']
    ];
  }
  
  // ============================================
  // CONFIGURAR ANCHOS DE COLUMNAS
  // ============================================
  private static setColumnWidths(sheet: XLSX.WorkSheet, widths: number[]): void {
    sheet['!cols'] = widths.map(width => ({ width }));
  }
  
  // ============================================
  // GENERAR NOMBRE DEL ARCHIVO
  // ============================================
  private static generateFileName(producto: KardexProduct): string {
    const now = new Date();
    const fecha = now.toISOString().split('T')[0]; // YYYY-MM-DD
    const hora = now.toTimeString().slice(0, 5).replace(':', ''); // HHMM
    
    const nombreLimpio = producto.nombre
      .replace(/[^a-zA-Z0-9\s]/g, '') // Remover caracteres especiales
      .replace(/\s+/g, '_') // Reemplazar espacios con guiones bajos
      .slice(0, 30); // Limitar longitud
    
    return `Kardex_${nombreLimpio}_${fecha}_${hora}.xlsx`;
  }
  
  // ============================================
  // EXPORTAR SOLO MOVIMIENTOS (VERSIÓN SIMPLE)
  // ============================================
  static exportMovimientosSimple(movimientos: KardexMovement[], producto: KardexProduct): void {
    const data = movimientos.map(mov => ({
      'Fecha': new Date(mov.fecha_movimiento).toLocaleDateString('es-PE'),
      'Tipo': mov.tipo_movimiento.toUpperCase(),
      'Cantidad': mov.cantidad,
      'Saldo': mov.saldo_corriente,
      'Precio Unit.': mov.precio_real || 0,
      'Valor Total': mov.valor_total || 0,
      'Motivo': mov.motivo_nombre,
      'Contenedor': mov.contenedor_nombre,
      'Empaquetado': mov.empaquetado || '',
      'Documento': mov.numero_documento || '',
      'Observación': mov.observacion || ''
    }));
    
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Kardex');
    
    const fileName = this.generateFileName(producto);
    XLSX.writeFile(workbook, fileName);
  }
}
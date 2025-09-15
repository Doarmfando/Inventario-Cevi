// src/features/containers/services/InventoryProductsService.ts
// VERSIÓN FINAL con gestión automática de estados por fechas

import { supabase } from '../../../lib/supabase';

export interface InventoryProduct {
  id: string;
  nombre: string;
  categoria: string;
  categoria_id: string;
  precio_estimado: number;
  unidad_medida: string;
  unidad_medida_id: string;
  es_perecedero: boolean;
  descripcion?: string;
}

export interface ProductToAdd {
  producto_id: string;
  contenedor_id: string;
  cantidad: number;
  empaquetado?: string;
  fecha_vencimiento?: string;
  precio_real_unidad: number;
  estado_producto_id?: string; // Puede ser 'fresco', 'congelado' o un UUID
}

export interface MovimientoInventario {
  producto_id: string;
  contenedor_id: string;
  tipo_movimiento: 'entrada' | 'salida' | 'transferencia' | 'ajuste';
  cantidad: number;
  precio_unitario: number;
  observaciones: string;
  usuario_id?: string;
}

export interface ContainerProductWithExpiration {
  id: string;
  nombre: string;
  cantidad: number;
  fecha_vencimiento: string | null;
  estado: string;
  dias_para_vencer: number | null;
  dias_almacenado: number;
  precio_real_unidad: number;
  valor_total: number;
  empaquetado?: string;
  fecha_ingreso: string;
}

export class InventoryProductsService {
  // ============================================
  // OBTENER PRODUCTOS DEL INVENTARIO
  // ============================================
  static async getInventoryProducts(): Promise<InventoryProduct[]> {
    try {
      const { data, error } = await supabase
        .from('productos')
        .select(`
          id,
          nombre,
          precio_estimado,
          descripcion,
          es_perecedero,
          categoria_id,
          unidad_medida_id,
          categoria:categorias!inner(
            id,
            nombre
          ),
          unidad_medida:unidades_medida!inner(
            id,
            nombre,
            abreviatura
          )
        `)
        .eq('visible', true)
        .order('nombre');

      if (error) throw error;

      return (data || []).map((product: any) => ({
        id: product.id,
        nombre: product.nombre,
        categoria: product.categoria?.nombre || 'Sin categoría',
        categoria_id: product.categoria_id,
        precio_estimado: product.precio_estimado || 0,
        unidad_medida: product.unidad_medida?.abreviatura || 'unidad',
        unidad_medida_id: product.unidad_medida_id,
        es_perecedero: product.es_perecedero || false,
        descripcion: product.descripcion || '',
      }));
    } catch (error) {
      console.error('Error obteniendo productos del inventario:', error);
      return [];
    }
  }

  // ============================================
  // BUSCAR PRODUCTOS EN INVENTARIO
  // ============================================
  static async searchInventoryProducts(searchTerm: string): Promise<InventoryProduct[]> {
    try {
      if (!searchTerm.trim()) {
        return await this.getInventoryProducts();
      }

      const { data, error } = await supabase
        .from('productos')
        .select(`
          id,
          nombre,
          precio_estimado,
          descripcion,
          es_perecedero,
          categoria_id,
          unidad_medida_id,
          categoria:categorias!inner(
            id,
            nombre
          ),
          unidad_medida:unidades_medida!inner(
            id,
            nombre,
            abreviatura
          )
        `)
        .eq('visible', true)
        .or(`nombre.ilike.%${searchTerm}%,descripcion.ilike.%${searchTerm}%`)
        .order('nombre');

      if (error) throw error;

      return (data || []).map((product: any) => ({
        id: product.id,
        nombre: product.nombre,
        categoria: product.categoria?.nombre || 'Sin categoría',
        categoria_id: product.categoria_id,
        precio_estimado: product.precio_estimado || 0,
        unidad_medida: product.unidad_medida?.abreviatura || 'unidad',
        unidad_medida_id: product.unidad_medida_id,
        es_perecedero: product.es_perecedero || false,
        descripcion: product.descripcion || '',
      }));
    } catch (error) {
      console.error('Error buscando productos en inventario:', error);
      return [];
    }
  }

  // ============================================
  // AGREGAR PRODUCTO AL CONTENEDOR
  // ============================================
  static async addProductToContainer(productData: ProductToAdd): Promise<boolean> {
    try {
      // Obtener o crear estado del producto
      let estadoId = null;
      if (productData.estado_producto_id) {
        // Si viene como texto (fresco/congelado), buscar el estado
        if (productData.estado_producto_id === 'fresco' || productData.estado_producto_id === 'congelado') {
          const nombreEstado = productData.estado_producto_id === 'fresco' ? 'Fresco' : 'Congelado';
          const { data: estado } = await supabase
            .from('estados_producto')
            .select('id')
            .eq('nombre', nombreEstado)
            .eq('visible', true)
            .single();
          
          estadoId = estado?.id || null;
        } else {
          estadoId = productData.estado_producto_id;
        }
      }

      // Insertar en detalle_contenedor
      const { data: containerProduct, error: insertError } = await supabase
        .from('detalle_contenedor')
        .insert({
          producto_id: productData.producto_id,
          contenedor_id: productData.contenedor_id,
          cantidad: productData.cantidad,
          empaquetado: productData.empaquetado || '1 unidad',
          fecha_vencimiento: productData.fecha_vencimiento || null,
          precio_real_unidad: productData.precio_real_unidad,
          estado_producto_id: estadoId,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // Registrar movimiento de inventario
      await this.registrarMovimientoInventario({
        producto_id: productData.producto_id,
        contenedor_id: productData.contenedor_id,
        tipo_movimiento: 'entrada',
        cantidad: productData.cantidad,
        precio_unitario: productData.precio_real_unidad,
        observaciones: 'Ingreso desde Inventario',
      });

      // Log del evento
      await supabase
        .from('log_eventos')
        .insert({
          accion: 'AGREGAR_PRODUCTO_CONTENEDOR',
          tabla_afectada: 'detalle_contenedor',
          registro_id: containerProduct.id,
          descripcion: 'Producto agregado al contenedor desde inventario'
        });

      return true;
    } catch (error) {
      console.error('Error agregando producto al contenedor:', error);
      return false;
    }
  }

  // ============================================
  // REGISTRAR MOVIMIENTO DE INVENTARIO
  // ============================================
  static async registrarMovimientoInventario(movimiento: MovimientoInventario): Promise<boolean> {
    try {
      // Obtener motivo de movimiento apropiado
      const { data: motivos, error: motivosError } = await supabase
        .from('motivos_movimiento')
        .select('id')
        .eq('tipo_movimiento', movimiento.tipo_movimiento)
        .eq('visible', true)
        .limit(1);

      if (motivosError) throw motivosError;

      const motivoId = motivos && motivos.length > 0 ? motivos[0].id : null;

      // Calcular stocks (simulado por ahora)
      const stockAnterior = 0;
      const stockNuevo = stockAnterior + (movimiento.tipo_movimiento === 'entrada' ? movimiento.cantidad : -movimiento.cantidad);

      const { error } = await supabase
        .from('movimientos')
        .insert({
          producto_id: movimiento.producto_id,
          contenedor_id: movimiento.contenedor_id,
          motivo_movimiento_id: motivoId,
          fecha_movimiento: new Date().toISOString(),
          cantidad: movimiento.cantidad,
          stock_anterior: stockAnterior,
          stock_nuevo: stockNuevo,
          precio_real: movimiento.precio_unitario,
          observacion: movimiento.observaciones,
          created_by: movimiento.usuario_id || null,
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error registrando movimiento de inventario:', error);
      return false;
    }
  }

  // ============================================
  // ACTUALIZAR ESTADOS AUTOMÁTICAMENTE BASADO EN FECHAS
  // ============================================
  static async updateProductStatesBasedOnExpiration(): Promise<void> {
    try {
      const today = new Date();
      const threeDaysFromNow = new Date();
      threeDaysFromNow.setDate(today.getDate() + 3);

      // Obtener estados
      const { data: estados } = await supabase
        .from('estados_producto')
        .select('id, nombre')
        .eq('visible', true);

      const estadoPorVencer = estados?.find(e => e.nombre.toLowerCase().includes('vencer'))?.id;
      const estadoVencido = estados?.find(e => e.nombre.toLowerCase() === 'vencido')?.id;

      // Actualizar productos vencidos
      if (estadoVencido) {
        await supabase
          .from('detalle_contenedor')
          .update({ estado_producto_id: estadoVencido })
          .lt('fecha_vencimiento', today.toISOString().split('T')[0])
          .not('estado_producto_id', 'eq', estadoVencido)
          .not('fecha_vencimiento', 'is', null);
      }

      // Actualizar productos por vencer (3-4 días)
      if (estadoPorVencer) {
        await supabase
          .from('detalle_contenedor')
          .update({ estado_producto_id: estadoPorVencer })
          .gte('fecha_vencimiento', today.toISOString().split('T')[0])
          .lte('fecha_vencimiento', threeDaysFromNow.toISOString().split('T')[0])
          .not('estado_producto_id', 'eq', estadoVencido)
          .not('fecha_vencimiento', 'is', null);
      }

    } catch (error) {
      console.error('Error actualizando estados automáticamente:', error);
    }
  }

  // ============================================
  // OBTENER PRODUCTOS DE CONTENEDOR CON INFORMACIÓN DE VENCIMIENTO
  // ============================================
  static async getContainerProductsWithExpiration(contenedor_id: string): Promise<ContainerProductWithExpiration[]> {
    try {
      const { data, error } = await supabase
        .from('detalle_contenedor')
        .select(`
          id,
          cantidad,
          fecha_vencimiento,
          precio_real_unidad,
          empaquetado,
          created_at,
          producto:productos!inner(nombre),
          estado_producto:estados_producto(nombre)
        `)
        .eq('contenedor_id', contenedor_id)
        .eq('visible', true);

      if (error) throw error;

      const today = new Date();
      
      return (data || []).map((item: any) => {
        const fechaVencimiento = item.fecha_vencimiento ? new Date(item.fecha_vencimiento) : null;
        const fechaIngreso = new Date(item.created_at);
        
        let diasParaVencer = null;
        let estado = item.estado_producto?.nombre || 'Sin estado';
        
        if (fechaVencimiento) {
          const diffTime = fechaVencimiento.getTime() - today.getTime();
          diasParaVencer = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          // Actualizar estado basado en días
          if (diasParaVencer < 0) {
            estado = `Vencido hace ${Math.abs(diasParaVencer)} día${Math.abs(diasParaVencer) !== 1 ? 's' : ''}`;
          } else if (diasParaVencer <= 3) {
            estado = `Por vencer en ${diasParaVencer} día${diasParaVencer !== 1 ? 's' : ''}`;
          }
        }
        
        const diasAlmacenado = Math.floor((today.getTime() - fechaIngreso.getTime()) / (1000 * 60 * 60 * 24));
        const valorTotal = item.cantidad * item.precio_real_unidad;
        
        return {
          id: item.id,
          nombre: item.producto?.nombre || 'Producto sin nombre',
          cantidad: item.cantidad,
          fecha_vencimiento: item.fecha_vencimiento,
          estado,
          dias_para_vencer: diasParaVencer,
          dias_almacenado: diasAlmacenado,
          precio_real_unidad: item.precio_real_unidad,
          valor_total: valorTotal,
          empaquetado: item.empaquetado,
          fecha_ingreso: item.created_at,
        };
      });
    } catch (error) {
      console.error('Error obteniendo productos del contenedor:', error);
      return [];
    }
  }

  // ============================================
  // OBTENER ESTADOS DE PRODUCTO
  // ============================================
  static async getProductStates(): Promise<Array<{id: string, nombre: string}>> {
    try {
      const { data, error } = await supabase
        .from('estados_producto')
        .select('id, nombre')
        .eq('visible', true)
        .order('nombre');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error obteniendo estados de producto:', error);
      return [];
    }
  }

  // ============================================
  // CREAR NUEVO PRODUCTO
  // ============================================
  static async createProduct(productData: {
    nombre: string;
    categoria_id: string;
    unidad_medida_id: string;
    precio_estimado: number;
    descripcion: string;
    es_perecedero: boolean;
  }): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('productos')
        .insert({
          nombre: productData.nombre,
          descripcion: productData.descripcion,
          categoria_id: productData.categoria_id,
          unidad_medida_id: productData.unidad_medida_id,
          precio_estimado: productData.precio_estimado,
          es_perecedero: productData.es_perecedero,
          visible: true
        });

      if (error) throw error;

      // Log del evento
      await supabase
        .from('log_eventos')
        .insert({
          accion: 'CREAR_PRODUCTO',
          tabla_afectada: 'productos',
          descripcion: `Producto creado: ${productData.nombre}`
        });

      return true;
    } catch (error) {
      console.error('Error creando producto:', error);
      return false;
    }
  }

  // ============================================
  // OBTENER CATEGORÍAS
  // ============================================
  static async getCategories(): Promise<Array<{id: string, nombre: string}>> {
    try {
      const { data, error } = await supabase
        .from('categorias')
        .select('id, nombre')
        .eq('visible', true)
        .order('nombre');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error obteniendo categorías:', error);
      return [];
    }
  }

  // ============================================
  // OBTENER UNIDADES DE MEDIDA
  // ============================================
  static async getUnits(): Promise<Array<{id: string, nombre: string, abreviatura: string}>> {
    try {
      const { data, error } = await supabase
        .from('unidades_medida')
        .select('id, nombre, abreviatura')
        .eq('visible', true)
        .order('nombre');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error obteniendo unidades de medida:', error);
      return [];
    }
  }
}
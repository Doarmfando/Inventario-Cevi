// src/features/containers/services/ContainerService.ts
// SERVICIO PARA CONTENEDORES CON BASE DE DATOS REAL

import { supabase } from '../../../lib/supabase';
import type {
  TipoContenedor,
  ContainerWithDetails,
  ContainerProduct,
  ContainerSummary,
  ContainerFormData,
  ProductToContainerFormData,
  ContainerFilters
} from '../types/container.types';

export class ContainerService {
  
  // ============================================
  // OBTENER TIPOS DE CONTENEDOR
  // ============================================
  static async getTiposContenedor(): Promise<TipoContenedor[]> {
    try {
      const { data, error } = await supabase
        .from('tipos_contenedor')
        .select('*')
        .eq('visible', true)
        .order('nombre');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error obteniendo tipos de contenedor:', error);
      return [];
    }
  }

  // ============================================
  // OBTENER CONTENEDORES CON DETALLES
  // ============================================
  static async getContenedores(filtros?: ContainerFilters): Promise<ContainerWithDetails[]> {
    try {
      let query = supabase
        .from('contenedores')
        .select(`
          id,
          codigo,
          nombre,
          descripcion,
          capacidad,
          tipo_contenedor:tipos_contenedor!inner(id, nombre, descripcion)
        `)
        .eq('visible', true)
        .order('nombre');

      // Aplicar filtros
      if (filtros?.tipo_contenedor_id) {
        query = query.eq('tipo_contenedor_id', filtros.tipo_contenedor_id);
      }

      if (filtros?.search) {
        query = query.or(`nombre.ilike.%${filtros.search}%,codigo.ilike.%${filtros.search}%`);
      }

      const { data: contenedores, error } = await query;

      if (error) throw error;
      if (!contenedores) return [];

      // Obtener estadísticas para cada contenedor
      const contenedoresConStats = await Promise.all(
        contenedores.map(async (contenedor: any) => {
          const stats = await this.getContainerStats(contenedor.id);
          
          return {
            id: contenedor.id,
            codigo: contenedor.codigo,
            nombre: contenedor.nombre,
            descripcion: contenedor.descripcion,
            capacidad: contenedor.capacidad,
            tipo_contenedor_nombre: contenedor.tipo_contenedor?.nombre || 'Sin tipo',
            tipo_contenedor_descripcion: contenedor.tipo_contenedor?.descripcion,
            ...stats
          } as ContainerWithDetails;
        })
      );

      // Aplicar filtros post-procesamiento
      let resultado = contenedoresConStats;

      if (filtros?.tiene_productos !== undefined) {
        resultado = resultado.filter(c => 
          filtros.tiene_productos ? c.total_productos > 0 : c.total_productos === 0
        );
      }

      if (filtros?.tiene_vencidos) {
        resultado = resultado.filter(c => c.productos_vencidos > 0);
      }

      if (filtros?.capacidad_min !== undefined) {
        resultado = resultado.filter(c => (c.capacidad || 0) >= filtros.capacidad_min!);
      }

      if (filtros?.capacidad_max !== undefined) {
        resultado = resultado.filter(c => (c.capacidad || 0) <= filtros.capacidad_max!);
      }

      return resultado;
    } catch (error) {
      console.error('Error obteniendo contenedores:', error);
      return [];
    }
  }

  // ============================================
  // OBTENER ESTADÍSTICAS DE UN CONTENEDOR
  // ============================================
  static async getContainerStats(contenedorId: string) {
    try {
      const { data: productos, error } = await supabase
        .from('detalle_contenedor')
        .select(`
          cantidad,
          precio_real_unidad,
          fecha_vencimiento,
          producto:productos!inner(nombre, categoria:categorias(nombre), unidad_medida:unidades_medida(abreviatura))
        `)
        .eq('contenedor_id', contenedorId)
        .eq('visible', true);

      if (error) throw error;

      if (!productos || productos.length === 0) {
        return {
          total_productos: 0,
          cantidad_total: 0,
          valor_total: 0,
          productos_vencidos: 0,
          productos_por_vencer: 0,
          ocupacion_porcentaje: 0
        };
      }

      const hoy = new Date();
      const enUnaSemana = new Date();
      enUnaSemana.setDate(hoy.getDate() + 7);

      let cantidad_total = 0;
      let valor_total = 0;
      let productos_vencidos = 0;
      let productos_por_vencer = 0;

      productos.forEach((item: any) => {
        cantidad_total += item.cantidad || 0;
        valor_total += (item.cantidad || 0) * (item.precio_real_unidad || 0);

        if (item.fecha_vencimiento) {
          const fechaVenc = new Date(item.fecha_vencimiento);
          if (fechaVenc < hoy) {
            productos_vencidos += 1;
          } else if (fechaVenc <= enUnaSemana) {
            productos_por_vencer += 1;
          }
        }
      });

      return {
        total_productos: productos.length,
        cantidad_total,
        valor_total,
        productos_vencidos,
        productos_por_vencer,
        ocupacion_porcentaje: 0 // Se calcula si hay capacidad definida
      };
    } catch (error) {
      console.error('Error calculando estadísticas del contenedor:', error);
      return {
        total_productos: 0,
        cantidad_total: 0,
        valor_total: 0,
        productos_vencidos: 0,
        productos_por_vencer: 0,
        ocupacion_porcentaje: 0
      };
    }
  }

  // ============================================
  // OBTENER PRODUCTOS DE UN CONTENEDOR
  // ============================================
  static async getContainerProducts(contenedorId: string): Promise<ContainerProduct[]> {
    try {
      const { data: productos, error } = await supabase
        .from('detalle_contenedor')
        .select(`
          id,
          producto_id,
          cantidad,
          empaquetado,
          fecha_vencimiento,
          precio_real_unidad,
          producto:productos!inner(
            nombre,
            categoria:categorias!inner(nombre),
            unidad_medida:unidades_medida!inner(abreviatura)
          ),
          estado_producto:estados_producto(nombre)
        `)
        .eq('contenedor_id', contenedorId)
        .eq('visible', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const hoy = new Date();
      const enUnaSemana = new Date();
      enUnaSemana.setDate(hoy.getDate() + 7);

      return (productos || []).map((item: any) => {
        const fechaVenc = item.fecha_vencimiento ? new Date(item.fecha_vencimiento) : null;
        let estadoCalculado: 'fresco' | 'por_vencer' | 'vencido' = 'fresco';
        let diasVencimiento = null;

        if (fechaVenc) {
          const diffTime = fechaVenc.getTime() - hoy.getTime();
          diasVencimiento = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          if (fechaVenc < hoy) {
            estadoCalculado = 'vencido';
          } else if (fechaVenc <= enUnaSemana) {
            estadoCalculado = 'por_vencer';
          }
        }

        return {
          id: item.id,
          producto_id: item.producto_id,
          producto_nombre: item.producto?.nombre || 'Sin nombre',
          categoria: item.producto?.categoria?.nombre || 'Sin categoría',
          unidad_medida: item.producto?.unidad_medida?.abreviatura || 'und',
          cantidad: item.cantidad,
          empaquetado: item.empaquetado,
          fecha_vencimiento: item.fecha_vencimiento,
          estado_producto: item.estado_producto?.nombre,
          precio_real_unidad: item.precio_real_unidad,
          valor_total: (item.cantidad || 0) * (item.precio_real_unidad || 0),
          dias_vencimiento: diasVencimiento,
          estado_calculado: estadoCalculado
        } as ContainerProduct;
      });
    } catch (error) {
      console.error('Error obteniendo productos del contenedor:', error);
      return [];
    }
  }

  // ============================================
  // CREAR CONTENEDOR
  // ============================================
  static async crearContenedor(data: ContainerFormData): Promise<string | null> {
    try {
      const { data: contenedor, error } = await supabase
        .from('contenedores')
        .insert({
          codigo: data.codigo,
          nombre: data.nombre,
          descripcion: data.descripcion,
          capacidad: data.capacidad,
          tipo_contenedor_id: data.tipo_contenedor_id,
          visible: true
        })
        .select()
        .single();

      if (error) throw error;

      // Log del evento
      await supabase
        .from('log_eventos')
        .insert({
          accion: 'CREAR_CONTENEDOR',
          tabla_afectada: 'contenedores',
          registro_afectado_id: contenedor.id,
          descripcion: `Contenedor creado: ${data.nombre}`
        });

      return contenedor.id;
    } catch (error) {
      console.error('Error creando contenedor:', error);
      return null;
    }
  }

  // ============================================
  // ACTUALIZAR CONTENEDOR
  // ============================================
  static async actualizarContenedor(id: string, data: Partial<ContainerFormData>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('contenedores')
        .update({
          ...data,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      // Log del evento
      await supabase
        .from('log_eventos')
        .insert({
          accion: 'ACTUALIZAR_CONTENEDOR',
          tabla_afectada: 'contenedores',
          registro_afectado_id: id,
          descripcion: `Contenedor actualizado: ${data.nombre || 'Sin nombre'}`
        });

      return true;
    } catch (error) {
      console.error('Error actualizando contenedor:', error);
      return false;
    }
  }

  // ============================================
  // ELIMINAR CONTENEDOR
  // ============================================
  static async eliminarContenedor(id: string): Promise<boolean> {
    try {
      // Verificar si tiene productos
      const { data: productos } = await supabase
        .from('detalle_contenedor')
        .select('id')
        .eq('contenedor_id', id)
        .eq('visible', true)
        .limit(1);

      if (productos && productos.length > 0) {
        throw new Error('No se puede eliminar un contenedor que tiene productos');
      }

      // Marcar como no visible en lugar de eliminar
      const { error } = await supabase
        .from('contenedores')
        .update({ visible: false })
        .eq('id', id);

      if (error) throw error;

      // Log del evento
      await supabase
        .from('log_eventos')
        .insert({
          accion: 'ELIMINAR_CONTENEDOR',
          tabla_afectada: 'contenedores',
          registro_afectado_id: id,
          descripcion: 'Contenedor eliminado'
        });

      return true;
    } catch (error) {
      console.error('Error eliminando contenedor:', error);
      return false;
    }
  }

  // ============================================
  // AGREGAR PRODUCTO A CONTENEDOR
  // ============================================
  static async agregarProductoAContenedor(data: ProductToContainerFormData): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('detalle_contenedor')
        .insert({
          producto_id: data.producto_id,
          contenedor_id: data.contenedor_id,
          cantidad: data.cantidad,
          empaquetado: data.empaquetado,
          fecha_vencimiento: data.fecha_vencimiento,
          estado_producto_id: data.estado_producto_id,
          precio_real_unidad: data.precio_real_unidad,
          visible: true
        });

      if (error) throw error;

      return true;
    } catch (error) {
      console.error('Error agregando producto al contenedor:', error);
      return false;
    }
  }

  // ============================================
  // OBTENER RESUMEN DE CONTENEDORES
  // ============================================
  static async getContainersSummary(): Promise<ContainerSummary[]> {
    try {
      const contenedores = await this.getContenedores();

      return contenedores.map(contenedor => ({
        id: contenedor.id,
        name: contenedor.nombre,
        type: contenedor.tipo_contenedor_nombre,
        capacity: contenedor.capacidad,
        status: 'activo' as const,
        stats: {
          totalProducts: contenedor.total_productos,
          totalQuantity: contenedor.cantidad_total,
          totalValue: contenedor.valor_total,
          vencidos: contenedor.productos_vencidos,
          porVencer: contenedor.productos_por_vencer,
          frescos: contenedor.total_productos - contenedor.productos_vencidos - contenedor.productos_por_vencer,
          capacityUsed: contenedor.cantidad_total,
          capacityPercentage: contenedor.ocupacion_porcentaje
        }
      }));
    } catch (error) {
      console.error('Error obteniendo resumen de contenedores:', error);
      return [];
    }
  }
}
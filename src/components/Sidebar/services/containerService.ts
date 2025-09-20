// ==============================================
// ARCHIVO: src/components/Sidebar/services/containerService.ts
// ==============================================
import { supabase } from '../../../lib/supabase';
import type { ContainerSummary, ContainerStats } from '../types/sidebar.types';
import { calculateContainerStatus } from '../utils/sidebarUtils';

export interface ContainerWithDetails {
  id: string;
  codigo: string;
  nombre: string;
  descripcion: string;
  capacidad: number;
  visible: boolean;
  created_at: string;
  updated_at: string;
  tipo_contenedor: {
    id: string;
    nombre: string;
    descripcion: string;
  };
}

export const containerService = {
  // Obtener contenedores con estadísticas para el sidebar
  async getContainersSummary(): Promise<ContainerSummary[]> {
    try {
      // 1. Obtener contenedores con sus tipos
      const { data: containers, error: containersError } = await supabase
        .from('contenedores')
        .select(`
          id,
          codigo,
          nombre,
          descripcion,
          capacidad,
          tipo_contenedor_id,
          tipos_contenedor!tipo_contenedor_id(id, nombre, descripcion)
        `)
        .eq('visible', true)
        .order('nombre') as { data: any[] | null; error: any };

      if (containersError) {
        console.error('Error obteniendo contenedores:', containersError);
        throw containersError;
      }

      if (!containers) {
        return [];
      }

      // 2. Para cada contenedor, obtener sus estadísticas
      const containersSummary: ContainerSummary[] = await Promise.all(
        containers.map(async (container) => {
          const stats = await this.getContainerStats(container.id);
          
          return {
            id: container.id,
            name: container.nombre,
            code: container.codigo || '',
            type: Array.isArray(container.tipos_contenedor) 
              ? container.tipos_contenedor[0]?.nombre || 'Sin tipo'
              : container.tipos_contenedor?.nombre || 'Sin tipo',
            typeId: Array.isArray(container.tipos_contenedor)
              ? container.tipos_contenedor[0]?.id || ''
              : container.tipos_contenedor?.id || '',
            status: calculateContainerStatus(stats),
            stats,
            capacity: container.capacidad,
            description: container.descripcion
          };
        })
      );

      return containersSummary;
    } catch (error) {
      console.error('Error en getContainersSummary:', error);
      return [];
    }
  },

  // Obtener estadísticas de un contenedor específico
  async getContainerStats(containerId: string): Promise<ContainerStats> {
    try {
      // Obtener productos en el contenedor con sus detalles
      const { data: productos, error } = await supabase
        .from('detalle_contenedor')
        .select(`
          cantidad,
          fecha_vencimiento,
          productos!detalle_contenedor_producto_id_fkey(stock_min),
          estados_producto!detalle_contenedor_estado_producto_id_fkey(nombre)
        `)
        .eq('contenedor_id', containerId)
        .eq('visible', true) as { data: any[] | null; error: any };

      if (error) {
        console.error('Error obteniendo stats del contenedor:', error);
        return { totalProducts: 0, vencidos: 0, porVencer: 0, stockBajo: 0 };
      }

      if (!productos || productos.length === 0) {
        return { totalProducts: 0, vencidos: 0, porVencer: 0, stockBajo: 0 };
      }

      const today = new Date();
      const sevenDaysFromNow = new Date();
      sevenDaysFromNow.setDate(today.getDate() + 7);

      let vencidos = 0;
      let porVencer = 0;
      let stockBajo = 0;

      productos.forEach((item) => {
        // Verificar vencimiento
        if (item.fecha_vencimiento) {
          const fechaVencimiento = new Date(item.fecha_vencimiento);
          if (fechaVencimiento < today) {
            vencidos++;
          } else if (fechaVencimiento <= sevenDaysFromNow) {
            porVencer++;
          }
        }

        // Verificar stock bajo (si el producto tiene stock_min configurado)
        const producto = Array.isArray(item.productos) ? item.productos[0] : item.productos;
        if (producto && producto.stock_min && item.cantidad < producto.stock_min) {
          stockBajo++;
        }
      });

      return {
        totalProducts: productos.length,
        vencidos,
        porVencer,
        stockBajo
      };
    } catch (error) {
      console.error('Error calculando estadísticas del contenedor:', error);
      return { totalProducts: 0, vencidos: 0, porVencer: 0, stockBajo: 0 };
    }
  },

  // Obtener un contenedor específico con detalles completos
  async getContainerById(id: string): Promise<ContainerWithDetails | null> {
    try {
      const { data, error } = await supabase
        .from('contenedores')
        .select(`
          *,
          tipos_contenedor!tipo_contenedor_id(*)
        `)
        .eq('id', id)
        .eq('visible', true)
        .single() as { data: any | null; error: any };

      if (error) {
        console.error('Error obteniendo contenedor por ID:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error en getContainerById:', error);
      return null;
    }
  }
};
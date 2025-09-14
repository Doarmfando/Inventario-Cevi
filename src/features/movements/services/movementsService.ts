// src/features/movements/services/movementsService.ts
// SERVICIO ACTUALIZADO CON CAMPO EMPAQUETADO

import { supabase } from '../../../lib/supabase';
import type {
  Movement,
  MovementFormData,
  MotivoMovimiento,
  AvailableProduct,
  MovementFilters,
  MovementType
} from '../types/movement.types';

export class MovementsService {
  
  // ============================================
  // OBTENER MOTIVOS DE MOVIMIENTO
  // ============================================
  static async getMotivosMovimiento(tipo?: MovementType): Promise<MotivoMovimiento[]> {
    try {
      let query = supabase
        .from('motivos_movimiento')
        .select('*')
        .eq('visible', true)
        .order('nombre');

      if (tipo) {
        query = query.eq('tipo_movimiento', tipo);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error obteniendo motivos:', error);
      return [];
    }
  }

  // ============================================
  // OBTENER PRODUCTOS DISPONIBLES PARA MOVIMIENTOS
  // ============================================
  static async getProductosDisponibles(): Promise<AvailableProduct[]> {
    try {
      const { data: productos, error } = await supabase
        .from('productos')
        .select(`
          *,
          categoria:categorias!inner(nombre),
          unidad_medida:unidades_medida!inner(nombre, abreviatura)
        `)
        .eq('visible', true)
        .order('nombre');

      if (error) throw error;
      if (!productos) return [];

      const productosCompletos = await Promise.all(
        productos.map(async (producto) => {
          // Obtener contenedor fijo
          const { data: contenedorFijo } = await supabase
            .from('producto_contenedor')
            .select(`
              contenedor:contenedores!inner(id, nombre)
            `)
            .eq('producto_id', producto.id)
            .eq('es_fijo', true)
            .single();

          // Obtener contenedores recomendados
          const { data: recomendados } = await supabase
            .from('producto_contenedor')
            .select(`
              contenedor:contenedores!inner(id, nombre)
            `)
            .eq('producto_id', producto.id)
            .eq('es_fijo', false);

          // Calcular stock actual y empaquetados
          const { data: detalles } = await supabase
            .from('detalle_contenedor')
            .select('cantidad, empaquetado')
            .eq('producto_id', producto.id)
            .eq('visible', true);

          const stock_actual = detalles?.reduce((sum, d) => sum + (d.cantidad || 0), 0) || 0;
          const total_empaquetados = detalles?.filter(d => d.empaquetado).length || 0;

          return {
            id: producto.id,
            nombre: producto.nombre,
            categoria: producto.categoria.nombre,
            unidad_medida: producto.unidad_medida.abreviatura,
            contenedor_fijo: contenedorFijo?.contenedor || undefined,
            contenedores_recomendados: (recomendados?.map(r => r.contenedor) || []).flat(),
            stock_actual,
            precio_estimado: producto.precio_estimado || 0,
            stock_min: producto.stock_min || 0,
            total_empaquetados
          } as AvailableProduct;
        })
      );

      return productosCompletos;
    } catch (error) {
      console.error('Error obteniendo productos disponibles:', error);
      return [];
    }
  }

  // ============================================
  // OBTENER MOVIMIENTOS CON FILTROS
  // ============================================
  static async getMovimientos(filtros?: MovementFilters): Promise<Movement[]> {
    try {
      let query = supabase
        .from('movimientos')
        .select(`
          *,
          producto:productos!inner(nombre, codigo),
          contenedor:contenedores!inner(nombre),
          motivo:motivos_movimiento!inner(nombre, tipo_movimiento, descripcion),
          categoria:productos(categoria:categorias(nombre)),
          unidad:productos(unidad_medida:unidades_medida(abreviatura))
        `)
        .order('fecha_movimiento', { ascending: false });

      // Aplicar filtros si existen
      if (filtros) {
        if (filtros.tipo_movimiento && filtros.tipo_movimiento !== 'all') {
          query = query.eq('motivo.tipo_movimiento', filtros.tipo_movimiento);
        }
        
        if (filtros.producto_id) {
          query = query.eq('producto_id', filtros.producto_id);
        }
        
        if (filtros.contenedor_id) {
          query = query.eq('contenedor_id', filtros.contenedor_id);
        }
        
        if (filtros.motivo_movimiento_id) {
          query = query.eq('motivo_movimiento_id', filtros.motivo_movimiento_id);
        }
        
        if (filtros.fecha_desde) {
          query = query.gte('fecha_movimiento', filtros.fecha_desde);
        }
        
        if (filtros.fecha_hasta) {
          query = query.lte('fecha_movimiento', filtros.fecha_hasta);
        }
        
        if (filtros.created_by) {
          query = query.eq('created_by', filtros.created_by);
        }
      }

      const { data, error } = await query;

      if (error) throw error;

      return (data || []).map(item => ({
        id: item.id,
        producto_id: item.producto_id,
        contenedor_id: item.contenedor_id,
        motivo_movimiento_id: item.motivo_movimiento_id,
        fecha_movimiento: item.fecha_movimiento,
        cantidad: item.cantidad,
        stock_anterior: item.stock_anterior,
        stock_nuevo: item.stock_nuevo,
        precio_real: item.precio_real,
        numero_documento: item.numero_documento,
        observacion: item.observacion,
        empaquetado: item.empaquetado, // AGREGADO
        created_by: item.created_by,
        
        // Datos joined
        producto_nombre: item.producto?.nombre,
        contenedor_nombre: item.contenedor?.nombre,
        categoria_nombre: item.categoria?.[0]?.categoria?.nombre,
        unidad_medida: item.unidad?.[0]?.unidad_medida?.abreviatura,
        motivo: item.motivo,
        valor_total: (item.cantidad || 0) * (item.precio_real || 0)
      }));
    } catch (error) {
      console.error('Error obteniendo movimientos:', error);
      return [];
    }
  }

  // ============================================
  // CREAR MOVIMIENTO CON EMPAQUETADO
  // ============================================
  static async crearMovimiento(data: MovementFormData): Promise<string | null> {
    try {
      // Obtener el stock actual del producto en el contenedor específico
      const { data: stockActual } = await supabase
        .from('detalle_contenedor')
        .select('cantidad')
        .eq('producto_id', data.producto_id)
        .eq('contenedor_id', data.contenedor_id)
        .eq('visible', true);

      const stock_anterior = stockActual?.reduce((sum, item) => sum + (item.cantidad || 0), 0) || 0;

      // Calcular nuevo stock basado en el tipo de movimiento
      let stock_nuevo = stock_anterior;
      const motivo = await this.getMotivosMovimiento().then(motivos => 
        motivos.find(m => m.id === data.motivo_movimiento_id)
      );

      if (motivo) {
        switch (motivo.tipo_movimiento) {
          case 'entrada':
            stock_nuevo = stock_anterior + data.cantidad;
            break;
          case 'salida':
            stock_nuevo = stock_anterior - data.cantidad;
            break;
          case 'ajuste':
            stock_nuevo = data.cantidad;
            break;
        }
      }

      // Insertar el movimiento (nota: la tabla movimientos no tiene campo empaquetado)
      const { data: movimiento, error: errorMovimiento } = await supabase
        .from('movimientos')
        .insert({
          producto_id: data.producto_id,
          contenedor_id: data.contenedor_id,
          motivo_movimiento_id: data.motivo_movimiento_id,
          cantidad: data.cantidad,
          stock_anterior,
          stock_nuevo,
          precio_real: data.precio_real,
          numero_documento: data.numero_documento,
          observacion: data.observacion
        })
        .select()
        .single();

      if (errorMovimiento || !movimiento) throw errorMovimiento;

      // Actualizar o crear detalle_contenedor CON EMPAQUETADO
      if (motivo?.tipo_movimiento === 'entrada') {
        // Para entradas, crear nuevo detalle_contenedor con empaquetado
        const { error: errorDetalle } = await supabase
          .from('detalle_contenedor')
          .insert({
            producto_id: data.producto_id,
            contenedor_id: data.contenedor_id,
            cantidad: data.cantidad,
            empaquetado: data.empaquetado || null, // AGREGADO: guardar empaquetado
            precio_real_unidad: data.precio_real,
            estado_producto_id: null, // Puedes obtener un estado por defecto si lo necesitas
            fecha_vencimiento: null, // Podrías agregar esto al formulario también
            visible: true
          });

        if (errorDetalle) {
          console.error('Error creando detalle_contenedor:', errorDetalle);
        }
      } else if (motivo?.tipo_movimiento === 'salida') {
        // Para salidas, actualizar cantidad en detalle_contenedor existente
        // Aquí podrías implementar lógica FIFO/LIFO si lo necesitas
        const { data: detallesExistentes } = await supabase
          .from('detalle_contenedor')
          .select('*')
          .eq('producto_id', data.producto_id)
          .eq('contenedor_id', data.contenedor_id)
          .eq('visible', true)
          .order('created_at', { ascending: true }); // FIFO

        if (detallesExistentes && detallesExistentes.length > 0) {
          let cantidadRestante = data.cantidad;
          
          for (const detalle of detallesExistentes) {
            if (cantidadRestante <= 0) break;
            
            const cantidadDescontar = Math.min(cantidadRestante, detalle.cantidad);
            const nuevaCantidad = detalle.cantidad - cantidadDescontar;
            
            if (nuevaCantidad <= 0) {
              // Si se agota el detalle, marcarlo como no visible
              await supabase
                .from('detalle_contenedor')
                .update({ cantidad: 0, visible: false })
                .eq('id', detalle.id);
            } else {
              // Actualizar la cantidad restante
              await supabase
                .from('detalle_contenedor')
                .update({ cantidad: nuevaCantidad })
                .eq('id', detalle.id);
            }
            
            cantidadRestante -= cantidadDescontar;
          }
        }
      } else if (motivo?.tipo_movimiento === 'ajuste') {
        // Para ajustes, actualizar todos los detalles del producto en el contenedor
        // Primero marcar todos como no visibles
        await supabase
          .from('detalle_contenedor')
          .update({ visible: false })
          .eq('producto_id', data.producto_id)
          .eq('contenedor_id', data.contenedor_id);
        
        // Luego crear un nuevo registro con la cantidad ajustada
        if (data.cantidad > 0) {
          await supabase
            .from('detalle_contenedor')
            .insert({
              producto_id: data.producto_id,
              contenedor_id: data.contenedor_id,
              cantidad: data.cantidad,
              empaquetado: data.empaquetado || null, // AGREGADO
              precio_real_unidad: data.precio_real,
              visible: true
            });
        }
      }

      // Log del evento
      await supabase
        .from('log_eventos')
        .insert({
          accion: 'CREAR_MOVIMIENTO',
          tabla_afectada: 'movimientos',
          registro_afectado_id: movimiento.id,
          descripcion: `Movimiento ${motivo?.tipo_movimiento} - ${motivo?.nombre}: ${data.cantidad} unidades${data.empaquetado ? ` (${data.empaquetado})` : ''}`
        });

      return movimiento.id;
    } catch (error) {
      console.error('Error creando movimiento:', error);
      return null;
    }
  }

  // ============================================
  // OBTENER KARDEX DE UN PRODUCTO
  // ============================================
  static async getKardexProducto(productoId: string): Promise<Movement[]> {
    try {
      const { data, error } = await supabase
        .from('movimientos')
        .select(`
          *,
          contenedor:contenedores!inner(nombre),
          motivo:motivos_movimiento!inner(nombre, tipo_movimiento)
        `)
        .eq('producto_id', productoId)
        .order('fecha_movimiento', { ascending: true });

      if (error) throw error;

      // También obtener información de empaquetado desde detalle_contenedor
      const movimientosConEmpaquetado = await Promise.all(
        (data || []).map(async (item) => {
          // Buscar el empaquetado en detalle_contenedor si es entrada
          let empaquetado = null;
          if (item.motivo?.tipo_movimiento === 'entrada') {
            const { data: detalle } = await supabase
              .from('detalle_contenedor')
              .select('empaquetado')
              .eq('producto_id', item.producto_id)
              .eq('contenedor_id', item.contenedor_id)
              .gte('created_at', item.fecha_movimiento)
              .order('created_at', { ascending: true })
              .limit(1)
              .single();
            
            empaquetado = detalle?.empaquetado;
          }

          return {
            id: item.id,
            producto_id: item.producto_id,
            contenedor_id: item.contenedor_id,
            motivo_movimiento_id: item.motivo_movimiento_id,
            fecha_movimiento: item.fecha_movimiento,
            cantidad: item.cantidad,
            stock_anterior: item.stock_anterior,
            stock_nuevo: item.stock_nuevo,
            precio_real: item.precio_real,
            numero_documento: item.numero_documento,
            observacion: item.observacion,
            empaquetado, // AGREGADO
            created_by: item.created_by,
            contenedor_nombre: item.contenedor?.nombre,
            motivo: item.motivo,
            valor_total: (item.cantidad || 0) * (item.precio_real || 0)
          };
        })
      );

      return movimientosConEmpaquetado;
    } catch (error) {
      console.error('Error obteniendo kardex:', error);
      return [];
    }
  }
}
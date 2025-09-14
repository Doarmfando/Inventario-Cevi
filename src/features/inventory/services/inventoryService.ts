// src/features/inventory/services/inventoryService.ts
import { supabase } from '../../../lib/supabase';
import type {
  DBCategoria,
  DBUnidadMedida,
  DBContenedor,
  ProductoInventario,
  FormularioProducto
} from '../types';
import { calcularEstadoInventario } from '../types';

export class InventoryService {
  
  // ============================================
  // OBTENER PRODUCTOS PARA VISTA INVENTARIO
  // ============================================
  static async getProductosInventario(): Promise<ProductoInventario[]> {
    try {
      const { data: productos, error } = await supabase
        .from('productos')
        .select(`
          *,
          categoria:categorias!inner(id, nombre, descripcion),
          unidad_medida:unidades_medida!inner(id, nombre, abreviatura)
        `)
        .eq('visible', true)
        .order('nombre');

      if (error) throw error;
      if (!productos) return [];

      const productosCompletos = await Promise.all(
        productos.map(async (producto) => {
          const { data: contenedorFijo } = await supabase
            .from('producto_contenedor')
            .select(`
              contenedor:contenedores!inner(id, nombre, codigo, descripcion, capacidad, visible)
            `)
            .eq('producto_id', producto.id)
            .eq('es_fijo', true)
            .single();

          const { data: recomendados } = await supabase
            .from('producto_contenedor')
            .select(`
              contenedor:contenedores!inner(id, nombre, codigo, descripcion, capacidad, visible)
            `)
            .eq('producto_id', producto.id)
            .eq('es_fijo', false);

          const { data: detalles } = await supabase
            .from('detalle_contenedor')
            .select('cantidad, empaquetado, contenedor:contenedores(nombre)')
            .eq('producto_id', producto.id)
            .eq('visible', true);

          const stock_actual = detalles?.reduce((sum, d) => sum + (d.cantidad || 0), 0) || 0;
          const empaquetados = detalles?.filter(d => d.empaquetado) || [];
          const total_empaquetados = empaquetados.length;

          const empaquetadosAgrupados = empaquetados.reduce((acc, d) => {
            const tipo = d.empaquetado || 'sin empaque';
            acc[tipo] = (acc[tipo] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);

          const empaquetados_detalle = Object.entries(empaquetadosAgrupados)
            .map(([tipo, cantidad]) => `${cantidad} ${tipo}`)
            .join(', ') || 'Sin empaquetados';

          const valor_total = stock_actual * (producto.precio_estimado || 0);

          const estado_inventario = calcularEstadoInventario(
            stock_actual,
            producto.stock_min || 0
          );

          return {
            id: producto.id,
            nombre: producto.nombre,
            descripcion: producto.descripcion,
            categoria: producto.categoria,
            unidad_medida: producto.unidad_medida,
            contenedor_fijo: contenedorFijo?.contenedor || undefined,
            contenedores_recomendados: (recomendados?.map(r => r.contenedor) || []).flat(),
            stock_actual,
            stock_min: producto.stock_min || 0,
            precio_estimado: producto.precio_estimado || 0,
            valor_total,
            estado_inventario,
            total_empaquetados,
            empaquetados_detalle,
            created_at: producto.created_at,
            updated_at: producto.updated_at
          } as ProductoInventario;
        })
      );

      return productosCompletos;
    } catch (error) {
      console.error('Error obteniendo productos inventario:', error);
      return [];
    }
  }

  // ============================================
  // CREAR PRODUCTO EN INVENTARIO
  // ============================================
  static async crearProducto(data: FormularioProducto): Promise<string | null> {
    try {
      const { data: producto, error: errorProducto } = await supabase
        .from('productos')
        .insert({
          nombre: data.nombre,
          descripcion: data.descripcion,
          categoria_id: data.categoria_id,
          unidad_medida_id: data.unidad_medida_id,
          precio_estimado: data.precio_estimado,
          stock_min: data.stock_min,
          visible: true
        })
        .select()
        .single();

      if (errorProducto || !producto) throw errorProducto;

      const { error: errorFijo } = await supabase
        .from('producto_contenedor')
        .insert({
          producto_id: producto.id,
          contenedor_id: data.contenedor_fijo_id,
          es_fijo: true
        });

      if (errorFijo) {
        await supabase.from('productos').delete().eq('id', producto.id);
        throw errorFijo;
      }

      if (data.contenedores_recomendados_ids.length > 0) {
        const recomendados = data.contenedores_recomendados_ids.map(cont_id => ({
          producto_id: producto.id,
          contenedor_id: cont_id,
          es_fijo: false
        }));

        const { error: errorRecom } = await supabase
          .from('producto_contenedor')
          .insert(recomendados);

        if (errorRecom) {
          console.error('Error asignando recomendados:', errorRecom);
        }
      }

      await supabase
        .from('log_eventos')
        .insert({
          accion: 'CREAR_PRODUCTO',
          tabla_afectada: 'productos',
          registro_afectado_id: producto.id,
          descripcion: `Producto ${data.nombre} creado desde inventario`
        });

      return producto.id;
    } catch (error) {
      console.error('Error creando producto:', error);
      return null;
    }
  }

  // ============================================
  // ACTUALIZAR PRODUCTO
  // ============================================
  static async actualizarProducto(
    id: string,
    updates: Partial<FormularioProducto>
  ): Promise<boolean> {
    try {
      const updateData: any = {};
      if (updates.nombre) updateData.nombre = updates.nombre;
      if (updates.descripcion !== undefined) updateData.descripcion = updates.descripcion;
      if (updates.categoria_id) updateData.categoria_id = updates.categoria_id;
      if (updates.unidad_medida_id) updateData.unidad_medida_id = updates.unidad_medida_id;
      if (updates.precio_estimado) updateData.precio_estimado = updates.precio_estimado;
      if (updates.stock_min !== undefined) updateData.stock_min = updates.stock_min;

      if (Object.keys(updateData).length > 0) {
        const { error } = await supabase
          .from('productos')
          .update(updateData)
          .eq('id', id);

        if (error) throw error;
      }

      if (updates.contenedor_fijo_id) {
        await supabase
          .from('producto_contenedor')
          .delete()
          .eq('producto_id', id)
          .eq('es_fijo', true);

        await supabase
          .from('producto_contenedor')
          .insert({
            producto_id: id,
            contenedor_id: updates.contenedor_fijo_id,
            es_fijo: true
          });
      }

      if (updates.contenedores_recomendados_ids) {
        await supabase
          .from('producto_contenedor')
          .delete()
          .eq('producto_id', id)
          .eq('es_fijo', false);

        if (updates.contenedores_recomendados_ids.length > 0) {
          const recomendados = updates.contenedores_recomendados_ids.map(cont_id => ({
            producto_id: id,
            contenedor_id: cont_id,
            es_fijo: false
          }));

          await supabase
            .from('producto_contenedor')
            .insert(recomendados);
        }
      }

      return true;
    } catch (error) {
      console.error('Error actualizando producto:', error);
      return false;
    }
  }

  // ============================================
  // ELIMINAR PRODUCTO (SOFT DELETE)
  // ============================================
  static async eliminarProducto(id: string): Promise<boolean> {
    try {
      const { data: detalles } = await supabase
        .from('detalle_contenedor')
        .select('cantidad')
        .eq('producto_id', id)
        .eq('visible', true);

      const tieneStock = detalles?.some(d => d.cantidad > 0);
      if (tieneStock) {
        throw new Error('No se puede eliminar un producto con stock existente');
      }

      const { error } = await supabase
        .from('productos')
        .update({ visible: false })
        .eq('id', id);

      if (error) throw error;

      return true;
    } catch (error) {
      console.error('Error eliminando producto:', error);
      throw error;
    }
  }

  // ============================================
  // OBTENER DATOS AUXILIARES
  // ============================================
  static async getCategorias(): Promise<DBCategoria[]> {
    try {
      const { data, error } = await supabase
        .from('categorias')
        .select('*')
        .eq('visible', true)
        .order('nombre');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error obteniendo categorías:', error);
      return [];
    }
  }

  static async getUnidadesMedida(): Promise<DBUnidadMedida[]> {
    try {
      const { data, error } = await supabase
        .from('unidades_medida')
        .select('*')
        .eq('visible', true)
        .order('nombre');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error obteniendo unidades:', error);
      return [];
    }
  }

  static async getContenedores(): Promise<DBContenedor[]> {
    try {
      const { data, error } = await supabase
        .from('contenedores')
        .select(`
          *,
          tipo_contenedor:tipos_contenedor(id, nombre)
        `)
        .eq('visible', true)
        .order('nombre');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error obteniendo contenedores:', error);
      return [];
    }
  }

  static async getEstadosProducto() {
    try {
      const { data, error } = await supabase
        .from('estados_producto')
        .select('*')
        .eq('visible', true)
        .order('nombre');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error obteniendo estados:', error);
      return [];
    }
  }

  // ============================================
  // OBTENER PRODUCTOS PARA UN CONTENEDOR
  // ============================================
  static async getProductosParaContenedor(contenedor_id: string) {
    try {
      const { data, error } = await supabase
        .from('producto_contenedor')
        .select(`
          producto:productos!inner(
            id,
            nombre,
            codigo,
            categoria:categorias(nombre),
            unidad_medida:unidades_medida(abreviatura)
          ),
          es_fijo
        `)
        .eq('contenedor_id', contenedor_id)
        .eq('producto.visible', true);

      if (error) throw error;

      return data?.map(item => {
        const producto = item.producto as any;
        return {
          id: producto.id,
          nombre: producto.nombre,
          codigo: producto.codigo,
          categoria: producto.categoria?.[0]?.nombre || 'Sin categoría',
          unidad: producto.unidad_medida?.[0]?.abreviatura || 'Sin unidad',
          es_contenedor_fijo: item.es_fijo
        };
      }) || [];
    } catch (error) {
      console.error('Error obteniendo productos para contenedor:', error);
      return [];
    }
  }
} 

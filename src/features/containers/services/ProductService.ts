// src/features/containers/services/ProductService.ts
// ADAPTADO para incluir es_perecedero

import { supabase } from '../../../lib/supabase';

interface ProductOption {
  id: string;
  nombre: string;
  categoria: string;
  precio_base: number;
  unidad_medida: string;
  es_perecedero: boolean;
}

interface NewProductData {
  nombre: string;
  categoria: string;
  precio_base: number;
  unidad_medida: string;
  descripcion: string;
  es_perecedero: boolean;
}

export class ProductService {
  // ============================================
  // OBTENER PRODUCTOS DISPONIBLES
  // ============================================
  static async getProducts(): Promise<ProductOption[]> {
    try {
      const { data, error } = await supabase
        .from('productos')
        .select(`
          id,
          nombre,
          precio_estimado,
          descripcion,
          es_perecedero,
          categoria:categorias!inner(nombre),
          unidad_medida:unidades_medida!inner(abreviatura)
        `)
        .eq('visible', true)
        .order('nombre');

      if (error) throw error;

      return (data || []).map((product: any) => ({
        id: product.id,
        nombre: product.nombre,
        categoria: product.categoria?.nombre || 'Sin categoría',
        precio_base: product.precio_estimado || 0,
        unidad_medida: product.unidad_medida?.abreviatura || 'unidad',
        es_perecedero: product.es_perecedero || false,
      }));
    } catch (error) {
      console.error('Error obteniendo productos:', error);
      return [];
    }
  }

  // ============================================
  // CREAR NUEVO PRODUCTO
  // ============================================
  static async createProduct(data: NewProductData): Promise<boolean> {
    try {
      // Primero necesitamos obtener los IDs de categoría y unidad de medida
      const [categoriaResult, unidadResult] = await Promise.all([
        supabase
          .from('categorias')
          .select('id')
          .eq('nombre', data.categoria)
          .eq('visible', true)
          .single(),
        supabase
          .from('unidades_medida')
          .select('id')
          .eq('abreviatura', data.unidad_medida)
          .eq('visible', true)
          .single()
      ]);

      if (categoriaResult.error || unidadResult.error) {
        console.error('Error obteniendo categoría o unidad:', categoriaResult.error, unidadResult.error);
        return false;
      }

      // Crear el producto
      const { error } = await supabase
        .from('productos')
        .insert({
          nombre: data.nombre,
          descripcion: data.descripcion,
          categoria_id: categoriaResult.data.id,
          unidad_medida_id: unidadResult.data.id,
          precio_estimado: data.precio_base,
          es_perecedero: data.es_perecedero,
          visible: true
        });

      if (error) throw error;

      // Log del evento
      await supabase
        .from('log_eventos')
        .insert({
          accion: 'CREAR_PRODUCTO',
          tabla_afectada: 'productos',
          descripcion: `Producto creado: ${data.nombre}`
        });

      return true;
    } catch (error) {
      console.error('Error creando producto:', error);
      return false;
    }
  }

  // ============================================
  // BUSCAR PRODUCTOS
  // ============================================
  static async searchProducts(term: string): Promise<ProductOption[]> {
    try {
      const { data, error } = await supabase
        .from('productos')
        .select(`
          id,
          nombre,
          precio_estimado,
          es_perecedero,
          categoria:categorias!inner(nombre),
          unidad_medida:unidades_medida!inner(abreviatura)
        `)
        .eq('visible', true)
        .or(`nombre.ilike.%${term}%,descripcion.ilike.%${term}%`)
        .order('nombre');

      if (error) throw error;

      return (data || []).map((product: any) => ({
        id: product.id,
        nombre: product.nombre,
        categoria: product.categoria?.nombre || 'Sin categoría',
        precio_base: product.precio_estimado || 0,
        unidad_medida: product.unidad_medida?.abreviatura || 'unidad',
        es_perecedero: product.es_perecedero || false,
      }));
    } catch (error) {
      console.error('Error buscando productos:', error);
      return [];
    }
  }

  // ============================================
  // OBTENER PRODUCTOS RECOMENDADOS POR TIPO DE CONTENEDOR
  // ============================================
  static async getRecommendedProducts(_tipoContenedor?: string): Promise<ProductOption[]> {
    try {
      // Por ahora retornamos todos los productos
      // En el futuro se puede implementar lógica específica por tipo
      return await this.getProducts();
    } catch (error) {
      console.error('Error obteniendo productos recomendados:', error);
      return [];
    }
  }
}
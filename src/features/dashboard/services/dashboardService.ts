// src/features/dashboard/services/dashboardService.ts
import { supabase } from '../../../lib/supabase';

export interface DashboardStats {
  totalProducts: number;
  totalValue: number;
  lowStockItems: number;
  categoriesCount: number;
  expiringItems: number;
  outOfStock: number;
}

export interface Product {
  id: string;
  name: string;
  quantity: number;
  minStock: number;
  expiryDate: string;
  category: string;
  unitPrice: number;
  totalValue: number;
}

export interface CategoryData {
  category: string;
  count: number;
  value: number;
}

// Tipos específicos para los datos de la base de datos
// Eliminados los tipos relacionados con contenedores

class DashboardService {
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      // Total productos activos
      const { count: totalProducts } = await supabase
        .from('productos')
        .select('*', { count: 'exact', head: true })
        .eq('visible', true);

      // Total categorías activas
      const { count: categoriesCount } = await supabase
        .from('categorias')
        .select('*', { count: 'exact', head: true })
        .eq('visible', true);

      // Obtener productos y calcular stats (sin contenedores)
      const { data: productos } = await supabase
        .from('productos')
        .select(`
          id,
          nombre,
          precio_estimado,
          stock_min
        `)
        .eq('visible', true);

      let totalValue = 0;
      let lowStockItems = 0;
      let expiringItems = 0; // No se puede calcular sin contenedores
      let outOfStock = 0;

      if (productos) {
        for (const producto of productos as any[]) {
          const totalStock = 0; // No hay detalle_contenedor
          const avgPrice = producto.precio_estimado || 0;
          totalValue += totalStock * avgPrice;

          if (producto.stock_min && totalStock < producto.stock_min) {
            lowStockItems++;
          }
          if (totalStock === 0) {
            outOfStock++;
          }
        }
      }

      return {
        totalProducts: totalProducts || 0,
        totalValue,
        lowStockItems,
        categoriesCount: categoriesCount || 0,
        expiringItems,
        outOfStock
      };

    } catch (error) {
      console.error('Error getting dashboard stats:', error);
      throw new Error('Error al obtener estadísticas del dashboard');
    }
  }

  async getLowStockProducts(): Promise<Product[]> {
    try {
      const { data } = await supabase
        .from('productos')
        .select(`
          id,
          nombre,
          stock_min,
          precio_estimado,
          categorias(nombre)
        `)
        .eq('visible', true)
        .not('stock_min', 'is', null);

      if (!data) return [];

      const lowStockProducts: Product[] = [];

      for (const producto of data as any[]) {
        const totalStock = 0; // No hay detalle_contenedor
        if (totalStock < (producto.stock_min || 0)) {
          const avgPrice = producto.precio_estimado || 0;
          lowStockProducts.push({
            id: producto.id,
            name: producto.nombre,
            quantity: totalStock,
            minStock: producto.stock_min || 0,
            expiryDate: '',
            category: producto.categorias?.nombre || 'Sin categoría',
            unitPrice: avgPrice,
            totalValue: totalStock * avgPrice
          });
        }
      }

      return lowStockProducts;

    } catch (error) {
      console.error('Error getting low stock products:', error);
      throw new Error('Error al obtener productos con stock bajo');
    }
  }

  async getExpiringProducts(): Promise<Product[]> {
    try {
      // No se puede obtener productos próximos a vencer sin contenedores
      return [];

    } catch (error) {
      console.error('Error getting expiring products:', error);
      throw new Error('Error al obtener productos próximos a vencer');
    }
  }

  async getProductsByCategory(): Promise<CategoryData[]> {
    try {
      const { data } = await supabase
        .from('categorias')
        .select(`
          nombre,
          productos!inner(
            id,
            precio_estimado
          )
        `)
        .eq('visible', true)
        .eq('productos.visible', true);

      if (!data) return [];

      return data.map((categoria: any) => {
        const productos = categoria.productos || [];
        let totalValue = 0;

        productos.forEach((producto: any) => {
          const stock = 0; // No hay detalle_contenedor
          const precio = producto.precio_estimado || 0;
          totalValue += stock * precio;
        });

        return {
          category: categoria.nombre,
          count: productos.length,
          value: totalValue
        };
      });

    } catch (error) {
      console.error('Error getting products by category:', error);
      throw new Error('Error al obtener productos por categoría');
    }
  }
}

export const dashboardService = new DashboardService();
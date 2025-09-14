// src/features/inventory/hooks/useInventory.ts
import { useState, useEffect } from "react";
import { InventoryService } from '../services/inventoryService';
import type { 
  ProductoInventario,
  FormularioProducto,
  DBCategoria,
  DBUnidadMedida,
  DBContenedor
} from '../types';

export const useInventory = () => {
  // Estados principales
  const [productos, setProductos] = useState<ProductoInventario[]>([]);
  const [categorias, setCategorias] = useState<DBCategoria[]>([]);
  const [unidades, setUnidades] = useState<DBUnidadMedida[]>([]);
  const [contenedores, setContenedores] = useState<DBContenedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos iniciales
  useEffect(() => {
    cargarDatosIniciales();
  }, []);

  const cargarDatosIniciales = async () => {
    try {
      setLoading(true);
      setError(null);

      const [
        productosData,
        categoriasData,
        unidadesData,
        contenedoresData
      ] = await Promise.all([
        InventoryService.getProductosInventario(),
        InventoryService.getCategorias(),
        InventoryService.getUnidadesMedida(),
        InventoryService.getContenedores()
      ]);

      setProductos(productosData);
      setCategorias(categoriasData);
      setUnidades(unidadesData);
      setContenedores(contenedoresData);
    } catch (err) {
      console.error('Error cargando datos:', err);
      setError('Error al cargar los datos del inventario');
    } finally {
      setLoading(false);
    }
  };

  // Recargar solo productos
  const recargarProductos = async () => {
    try {
      const productosData = await InventoryService.getProductosInventario();
      setProductos(productosData);
    } catch (err) {
      console.error('Error recargando productos:', err);
    }
  };

  // ============================================
  // CREAR PRODUCTO
  // ============================================
  const addProduct = async (data: FormularioProducto): Promise<boolean> => {
    try {
      const productoId = await InventoryService.crearProducto(data);
      if (productoId) {
        await recargarProductos();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error creando producto:', err);
      return false;
    }
  };

  // ============================================
  // ACTUALIZAR PRODUCTO
  // ============================================
  const updateProduct = async (id: string, updates: Partial<FormularioProducto>): Promise<boolean> => {
    try {
      const success = await InventoryService.actualizarProducto(id, updates);
      if (success) {
        await recargarProductos();
      }
      return success;
    } catch (err) {
      console.error('Error actualizando producto:', err);
      return false;
    }
  };

  // ============================================
  // ELIMINAR PRODUCTO
  // ============================================
  const deleteProduct = async (id: string): Promise<boolean> => {
    try {
      // Verificar si tiene stock
      const producto = productos.find(p => p.id === id);
      if (producto && producto.stock_actual > 0) {
        throw new Error('No se puede eliminar un producto con stock existente');
      }

      const success = await InventoryService.eliminarProducto(id);
      if (success) {
        await recargarProductos();
      }
      return success;
    } catch (err: any) {
      alert(err.message || 'Error eliminando producto');
      return false;
    }
  };

  // ============================================
  // FORMATEAR PRODUCTOS PARA LA TABLA (Compatibilidad)
  // ============================================
  const getProductsWithCalculatedData = () => {
    return productos.map(producto => {
      // Obtener nombre del contenedor principal
      const contenedorNombre = producto.contenedor_fijo?.nombre || 'Sin asignar';
      
      return {
        // IDs y datos básicos
        id: producto.id,
        name: producto.nombre,
        
        // Contenedor principal
        container: contenedorNombre,
        
        // Categoría
        category: producto.categoria.nombre,
        
        // Stock y unidad
        quantity: producto.stock_actual,
        unit: producto.unidad_medida.abreviatura,
        
        // Estado del inventario
        stockStatus: producto.estado_inventario,
        state: producto.estado_inventario, // Para compatibilidad
        
        // Precios
        price: producto.precio_estimado,
        totalValue: producto.valor_total,
        
        // Stock mínimo
        minStock: producto.stock_min,
        
        // Empaquetados
        empaquetados: producto.empaquetados_detalle,
        packagedUnits: producto.total_empaquetados,
        
        // Campos adicionales para compatibilidad con la tabla actual
        supplier: '', // No se usa en tu sistema
        estimatedDaysToExpiry: 0, // Se calcula en detalle_contenedor
        weightPerPackage: 0, // Se define en detalle_contenedor
        packagedExpiryDays: 0, // Se define en detalle_contenedor
        nearExpiryPackages: 0, // Se calcula dinámicamente
        entryDate: producto.created_at,
        lastUpdated: producto.updated_at,
        expiryDate: '', // Se obtiene de detalle_contenedor
        availableStock: producto.stock_actual,
        packagedWeight: 0,
        porVencer: '0', // Se calculará cuando tengamos fechas de vencimiento
        
        // Datos originales por si los necesitas
        _original: producto
      };
    });
  };

  // ============================================
  // ESTADÍSTICAS
  // ============================================
  const getStats = () => {
    const totalProducts = productos.length;
    const totalValue = productos.reduce((sum, p) => sum + p.valor_total, 0);
    
    // Contar por estado
    const lowStockItems = productos.filter(p => 
      p.estado_inventario === 'Stock Bajo' || p.estado_inventario === 'Reponer'
    ).length;
    
    const outOfStock = productos.filter(p => 
      p.estado_inventario === 'Sin Stock'
    ).length;
    
    // Por ahora, estos se calcularán cuando implementemos detalle_contenedor
    const expiringItems = 0; // Se calculará con fechas de vencimiento
    const expiredItems = 0; // Se calculará con fechas de vencimiento
    
    return {
      totalProducts,
      totalValue,
      lowStockItems,
      expiringItems,
      expiredItems,
      outOfStock
    };
  };

  // ============================================
  // PRODUCTOS CON ALERTAS
  // ============================================
  const getLowStockProducts = () => {
    return productos.filter(p => 
      p.estado_inventario === 'Stock Bajo' || 
      p.estado_inventario === 'Reponer' ||
      p.estado_inventario === 'Sin Stock'
    );
  };

  const getExpiringProducts = () => {
    // Por implementar cuando tengamos fechas de vencimiento en detalle_contenedor
    return [];
  };

  // ============================================
  // HELPERS PARA FORMULARIOS
  // ============================================
  
  // Obtener contenedores disponibles para un producto
  const getContenedoresDisponibles = () => {
    return contenedores.map(c => ({
      id: c.id,
      nombre: c.nombre,
      codigo: c.codigo,
      tipo: c.tipo_contenedor_id
    }));
  };

  // Obtener categorías para selector
  const getCategoriasDisponibles = () => {
    return categorias.map(c => ({
      id: c.id,
      nombre: c.nombre
    }));
  };

  // Obtener unidades de medida para selector
  const getUnidadesDisponibles = () => {
    return unidades.map(u => ({
      id: u.id,
      nombre: u.nombre,
      abreviatura: u.abreviatura
    }));
  };

  // ============================================
  // RETURN DEL HOOK
  // ============================================
  return {
    // Datos principales
    products: getProductsWithCalculatedData(), // Para compatibilidad con tabla actual
    productosRaw: productos, // Datos originales si los necesitas
    categorias,
    unidades,
    contenedores,
    
    // Estado
    loading,
    error,
    
    // CRUD
    addProduct,
    updateProduct,
    deleteProduct,
    
    // Recargar datos
    refreshProducts: recargarProductos,
    updateProductStates: recargarProductos, // Alias para compatibilidad
    
    // Estadísticas
    getStats,
    getLowStockProducts,
    getExpiringProducts,
    
    // Helpers para formularios
    getContenedoresDisponibles,
    getCategoriasDisponibles,
    getUnidadesDisponibles
  };
};
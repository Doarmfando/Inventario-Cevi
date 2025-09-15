// src/features/containers/hooks/useProducts.ts

import { useState, useEffect, useCallback } from 'react';
import { ProductService } from '../services/ProductService';
import { InventoryProductsService } from '../services/InventoryProductsService';

interface ProductOption {
  id: string;
  nombre: string;
  categoria: string;
  precio_base: number;
  unidad_medida: string;
  isFromInventory?: boolean; // Nueva propiedad para diferenciar
}

interface NewProductData {
  nombre: string;
  categoria: string;
  precio_base: number;
  unidad_medida: string;
}

interface UseProductsReturn {
  products: ProductOption[];
  inventoryProducts: ProductOption[];
  recommendedProducts: ProductOption[];
  loading: boolean;
  error: string | null;
  createProduct: (data: NewProductData) => Promise<boolean>;
  searchProducts: (term: string) => ProductOption[];
  refreshProducts: () => Promise<void>;
}

export const useProducts = (): UseProductsReturn => {
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [inventoryProducts, setInventoryProducts] = useState<ProductOption[]>([]);
  const [recommendedProducts, setRecommendedProducts] = useState<ProductOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Cargar productos del inventario
      const inventoryList = await InventoryProductsService.getInventoryProducts();
      const formattedInventoryProducts: ProductOption[] = inventoryList.map(product => ({
        id: product.id,
        nombre: product.nombre,
        categoria: product.categoria,
        precio_base: product.precio_estimado,
        unidad_medida: product.unidad_medida,
        isFromInventory: true
      }));

      // Cargar productos recomendados (del servicio original)
      const recommendedList = await ProductService.getProducts();
      const formattedRecommendedProducts: ProductOption[] = recommendedList.map(product => ({
        id: product.id,
        nombre: product.nombre,
        categoria: product.categoria,
        precio_base: product.precio_base,
        unidad_medida: product.unidad_medida,
        isFromInventory: false
      }));

      // Combinar ambas listas, priorizando los del inventario
      const allProducts = [...formattedInventoryProducts, ...formattedRecommendedProducts];
      
      setInventoryProducts(formattedInventoryProducts);
      setRecommendedProducts(formattedRecommendedProducts);
      setProducts(allProducts);
      
    } catch (err) {
      console.error('Error cargando productos:', err);
      setError('Error al cargar los productos');
    } finally {
      setLoading(false);
    }
  }, []);

  const createProduct = useCallback(async (data: NewProductData): Promise<boolean> => {
    try {
      // Usar el InventoryProductsService para crear productos
      const categoryData = await InventoryProductsService.getCategories();
      const unitsData = await InventoryProductsService.getUnits();
      
      const category = categoryData.find(c => c.nombre === data.categoria);
      const unit = unitsData.find(u => u.nombre === data.unidad_medida || u.abreviatura === data.unidad_medida);
      
      if (!category || !unit) {
        setError('Categoría o unidad de medida no encontrada');
        return false;
      }

      const success = await InventoryProductsService.createProduct({
        nombre: data.nombre,
        categoria_id: category.id,
        unidad_medida_id: unit.id,
        precio_estimado: data.precio_base,
        descripcion: '',
        es_perecedero: false, // Valor por defecto
      });

      if (success) {
        await loadProducts(); // Recargar la lista
        return true;
      }
      setError('Error al crear el producto');
      return false;
    } catch (err) {
      console.error('Error creando producto:', err);
      setError('Error al crear el producto');
      return false;
    }
  }, [loadProducts]);

  const searchProducts = useCallback((term: string): ProductOption[] => {
    if (!term.trim()) return products;
        
    return products.filter(product =>
      product.nombre.toLowerCase().includes(term.toLowerCase()) ||
      product.categoria.toLowerCase().includes(term.toLowerCase())
    );
  }, [products]);

  const refreshProducts = useCallback(async () => {
    await loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  return {
    products,
    inventoryProducts,
    recommendedProducts,
    loading,
    error,
    createProduct,
    searchProducts,
    refreshProducts,
  };
};
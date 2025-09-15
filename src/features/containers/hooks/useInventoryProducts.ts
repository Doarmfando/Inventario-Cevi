// src/features/containers/hooks/useInventoryProducts.ts

import { useState, useEffect, useCallback } from 'react';
import { 
  InventoryProductsService, 
  type InventoryProduct, 
  type ProductToAdd 
} from '../services/InventoryProductsService';

interface UseInventoryProductsReturn {
  products: InventoryProduct[];
  categories: Array<{id: string, nombre: string}>;
  units: Array<{id: string, nombre: string, abreviatura: string}>;
  productStates: Array<{id: string, nombre: string}>;
  loading: boolean;
  error: string | null;
  searchProducts: (term: string) => Promise<void>;
  addProductToContainer: (data: ProductToAdd) => Promise<boolean>;
  createProduct: (data: {
    nombre: string;
    categoria_id: string;
    unidad_medida_id: string;
    precio_estimado: number;
    descripcion: string;
    es_perecedero: boolean;
  }) => Promise<boolean>;
  refreshProducts: () => Promise<void>;
}

export const useInventoryProducts = (): UseInventoryProductsReturn => {
  const [products, setProducts] = useState<InventoryProduct[]>([]);
  const [categories, setCategories] = useState<Array<{id: string, nombre: string}>>([]);
  const [units, setUnits] = useState<Array<{id: string, nombre: string, abreviatura: string}>>([]);
  const [productStates, setProductStates] = useState<Array<{id: string, nombre: string}>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar productos del inventario
  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const productList = await InventoryProductsService.getInventoryProducts();
      setProducts(productList);
    } catch (err) {
      console.error('Error cargando productos:', err);
      setError('Error al cargar los productos del inventario');
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar datos maestros
  const loadMasterData = useCallback(async () => {
    try {
      const [categoriesData, unitsData, statesData] = await Promise.all([
        InventoryProductsService.getCategories(),
        InventoryProductsService.getUnits(),
        InventoryProductsService.getProductStates()
      ]);

      setCategories(categoriesData);
      setUnits(unitsData);
      setProductStates(statesData);
    } catch (err) {
      console.error('Error cargando datos maestros:', err);
      setError('Error al cargar datos maestros');
    }
  }, []);

  // Buscar productos
  const searchProducts = useCallback(async (term: string) => {
    try {
      setLoading(true);
      setError(null);
      const searchResults = await InventoryProductsService.searchInventoryProducts(term);
      setProducts(searchResults);
    } catch (err) {
      console.error('Error buscando productos:', err);
      setError('Error al buscar productos');
    } finally {
      setLoading(false);
    }
  }, []);

  // Agregar producto al contenedor
  const addProductToContainer = useCallback(async (data: ProductToAdd): Promise<boolean> => {
    try {
      const success = await InventoryProductsService.addProductToContainer(data);
      if (success) {
        return true;
      }
      setError('Error al agregar el producto al contenedor');
      return false;
    } catch (err) {
      console.error('Error agregando producto al contenedor:', err);
      setError('Error al agregar el producto al contenedor');
      return false;
    }
  }, []);

  // Crear nuevo producto
  const createProduct = useCallback(async (data: {
    nombre: string;
    categoria_id: string;
    unidad_medida_id: string;
    precio_estimado: number;
    descripcion: string;
    es_perecedero: boolean;
  }): Promise<boolean> => {
    try {
      const success = await InventoryProductsService.createProduct(data);
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

  // Refrescar productos
  const refreshProducts = useCallback(async () => {
    await loadProducts();
  }, [loadProducts]);

  // Cargar datos iniciales
  useEffect(() => {
    Promise.all([
      loadProducts(),
      loadMasterData()
    ]);
  }, [loadProducts, loadMasterData]);

  return {
    products,
    categories,
    units,
    productStates,
    loading,
    error,
    searchProducts,
    addProductToContainer,
    createProduct,
    refreshProducts,
  };
};
// src/features/containers/hooks/useContainers.ts
// HOOK PRINCIPAL PARA GESTIÓN DE CONTENEDORES

import { useState, useEffect, useCallback } from 'react';
import { ContainerService } from '../services/ContainerService.ts';
import type {
  ContainerSummary,
  TipoContenedor,
  ContainerFormData,
  ContainerFilters
} from '../types/container.types';

interface UseContainersReturn {
  // Estados
  containers: ContainerSummary[];
  tiposContenedor: TipoContenedor[];
  loading: boolean;
  error: string | null;
  
  // Acciones
  cargarContenedores: (filtros?: ContainerFilters) => Promise<void>;
  crearContenedor: (data: ContainerFormData) => Promise<boolean>;
  actualizarContenedor: (id: string, data: Partial<ContainerFormData>) => Promise<boolean>;
  eliminarContenedor: (id: string) => Promise<boolean>;
  refrescar: () => Promise<void>;
  
  // Estados de filtros
  filtrosActuales: ContainerFilters;
  aplicarFiltros: (filtros: ContainerFilters) => Promise<void>;
  limpiarFiltros: () => Promise<void>;
}

export const useContainers = (): UseContainersReturn => {
  const [containers, setContainers] = useState<ContainerSummary[]>([]);
  const [tiposContenedor, setTiposContenedor] = useState<TipoContenedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtrosActuales, setFiltrosActuales] = useState<ContainerFilters>({});

  // Cargar tipos de contenedor
  const cargarTiposContenedor = useCallback(async () => {
    try {
      const tipos = await ContainerService.getTiposContenedor();
      setTiposContenedor(tipos);
    } catch (err) {
      console.error('Error cargando tipos de contenedor:', err);
    }
  }, []);

  // Cargar contenedores
  const cargarContenedores = useCallback(async (filtros?: ContainerFilters) => {
    try {
      setLoading(true);
      setError(null);
      
      const contenedoresData = await ContainerService.getContainersSummary();
      setContainers(contenedoresData);
      
      if (filtros) {
        setFiltrosActuales(filtros);
      }
    } catch (err) {
      console.error('Error cargando contenedores:', err);
      setError('Error al cargar los contenedores');
    } finally {
      setLoading(false);
    }
  }, []);

  // Crear contenedor
  const crearContenedor = useCallback(async (data: ContainerFormData): Promise<boolean> => {
    try {
      setLoading(true);
      const id = await ContainerService.crearContenedor(data);
      
      if (id) {
        await cargarContenedores(filtrosActuales);
        return true;
      }
      
      setError('Error al crear el contenedor');
      return false;
    } catch (err) {
      console.error('Error creando contenedor:', err);
      setError('Error al crear el contenedor');
      return false;
    } finally {
      setLoading(false);
    }
  }, [filtrosActuales, cargarContenedores]);

  // Actualizar contenedor
  const actualizarContenedor = useCallback(async (
    id: string, 
    data: Partial<ContainerFormData>
  ): Promise<boolean> => {
    try {
      setLoading(true);
      const success = await ContainerService.actualizarContenedor(id, data);
      
      if (success) {
        await cargarContenedores(filtrosActuales);
        return true;
      }
      
      setError('Error al actualizar el contenedor');
      return false;
    } catch (err) {
      console.error('Error actualizando contenedor:', err);
      setError('Error al actualizar el contenedor');
      return false;
    } finally {
      setLoading(false);
    }
  }, [filtrosActuales, cargarContenedores]);

  // Eliminar contenedor
  const eliminarContenedor = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      const success = await ContainerService.eliminarContenedor(id);
      
      if (success) {
        await cargarContenedores(filtrosActuales);
        return true;
      }
      
      setError('Error al eliminar el contenedor');
      return false;
    } catch (err) {
      console.error('Error eliminando contenedor:', err);
      setError('Error al eliminar el contenedor');
      return false;
    } finally {
      setLoading(false);
    }
  }, [filtrosActuales, cargarContenedores]);

  // Aplicar filtros
  const aplicarFiltros = useCallback(async (filtros: ContainerFilters) => {
    setFiltrosActuales(filtros);
    await cargarContenedores(filtros);
  }, [cargarContenedores]);

  // Limpiar filtros
  const limpiarFiltros = useCallback(async () => {
    setFiltrosActuales({});
    await cargarContenedores({});
  }, [cargarContenedores]);

  // Refrescar
  const refrescar = useCallback(async () => {
    await cargarContenedores(filtrosActuales);
  }, [filtrosActuales, cargarContenedores]);

  // Cargar datos iniciales
  useEffect(() => {
    const cargarDatosIniciales = async () => {
      await Promise.all([
        cargarTiposContenedor(),
        cargarContenedores()
      ]);
    };

    cargarDatosIniciales();
  }, [cargarTiposContenedor, cargarContenedores]);

  return {
    // Estados
    containers,
    tiposContenedor,
    loading,
    error,
    
    // Acciones
    cargarContenedores,
    crearContenedor,
    actualizarContenedor,
    eliminarContenedor,
    refrescar,
    
    // Filtros
    filtrosActuales,
    aplicarFiltros,
    limpiarFiltros
  };
};
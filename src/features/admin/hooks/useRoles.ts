// src/features/admin/hooks/useRoles.ts
import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../../lib/supabase';

export interface Role {
  id: string;
  nombre: string;
  descripcion: string;
  visible: boolean;
  created_at: string;
}

export interface CreateRole {
  nombre: string;
  descripcion: string;
}

export function useRoles() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Usar ref para evitar llamadas múltiples
  const isLoadingRef = useRef(false);
  const isMountedRef = useRef(true);

  // Función helper para verificar si el componente sigue montado
  const isMounted = () => isMountedRef.current;

  // Obtener todos los roles con protección contra llamadas múltiples
  const fetchRoles = async (force = false) => {
    // Evitar llamadas concurrentes
    if (isLoadingRef.current && !force) {
      console.log('🔄 fetchRoles ya en progreso, omitiendo...');
      return;
    }

    isLoadingRef.current = true;
    
    if (isMounted()) {
      setLoading(true);
      setError(null);
    }

    try {
      console.log('📥 Cargando roles...');
      
      const { data, error } = await supabase
        .from('roles')
        .select('*')
        .eq('visible', true)
        .order('nombre');
      
      if (error) {
        console.error('❌ Error cargando roles:', error);
        throw error;
      }

      if (isMounted()) {
        console.log('✅ Roles cargados:', data?.length || 0);
        setRoles(data || []);
      }
      
    } catch (err) {
      console.error('💥 Error en fetchRoles:', err);
      if (isMounted()) {
        setError(err instanceof Error ? err.message : 'Error al cargar roles');
      }
    } finally {
      isLoadingRef.current = false;
      if (isMounted()) {
        setLoading(false);
      }
    }
  };

  // Crear rol con protección
  const createRole = async (newRole: CreateRole): Promise<boolean> => {
    if (isLoadingRef.current) {
      console.warn('⚠️ Operación en progreso, omitiendo createRole');
      return false;
    }

    try {
      console.log('➕ Creando rol:', newRole.nombre);
      
      const { data, error } = await supabase
        .from('roles')
        .insert({
          nombre: newRole.nombre.toLowerCase().trim(),
          descripcion: newRole.descripcion.trim(),
          visible: true
        })
        .select()
        .single();
      
      if (error) {
        console.error('❌ Error creando rol:', error);
        throw error;
      }
      
      if (isMounted()) {
        console.log('✅ Rol creado:', data);
        setRoles(prev => [data, ...prev]);
        setError(null);
      }
      
      return true;
    } catch (err) {
      console.error('💥 Error en createRole:', err);
      if (isMounted()) {
        setError(err instanceof Error ? err.message : 'Error al crear rol');
      }
      return false;
    }
  };

  // Actualizar rol con protección
  const updateRole = async (id: string, updates: Partial<CreateRole>): Promise<boolean> => {
    if (isLoadingRef.current) {
      console.warn('⚠️ Operación en progreso, omitiendo updateRole');
      return false;
    }

    try {
      console.log('✏️ Actualizando rol:', id);
      
      const cleanUpdates: any = {};
      if (updates.nombre) {
        cleanUpdates.nombre = updates.nombre.toLowerCase().trim();
      }
      if (updates.descripcion) {
        cleanUpdates.descripcion = updates.descripcion.trim();
      }
      
      const { data, error } = await supabase
        .from('roles')
        .update(cleanUpdates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('❌ Error actualizando rol:', error);
        throw error;
      }
      
      if (isMounted()) {
        console.log('✅ Rol actualizado:', data);
        setRoles(prev => prev.map(role => 
          role.id === id ? data : role
        ));
        setError(null);
      }
      
      return true;
    } catch (err) {
      console.error('💥 Error en updateRole:', err);
      if (isMounted()) {
        setError(err instanceof Error ? err.message : 'Error al actualizar rol');
      }
      return false;
    }
  };

  // Eliminar rol con protección y validación
  const deleteRole = async (id: string): Promise<boolean> => {
    if (isLoadingRef.current) {
      console.warn('⚠️ Operación en progreso, omitiendo deleteRole');
      return false;
    }

    try {
      console.log('🗑️ Eliminando rol:', id);
      
      // Verificar que no haya usuarios con este rol
      const { count, error: countError } = await supabase
        .from('usuarios')
        .select('id', { count: 'exact' })
        .eq('rol_id', id)
        .eq('visible', true);
      
      if (countError) {
        console.error('❌ Error verificando usuarios:', countError);
        throw countError;
      }
      
      if (count && count > 0) {
        const errorMsg = 'No se puede eliminar un rol que tiene usuarios asignados';
        console.error('❌', errorMsg);
        if (isMounted()) {
          setError(errorMsg);
        }
        return false;
      }

      // Proceder con la eliminación (soft delete)
      const { error } = await supabase
        .from('roles')
        .update({ visible: false })
        .eq('id', id);
      
      if (error) {
        console.error('❌ Error eliminando rol:', error);
        throw error;
      }
      
      if (isMounted()) {
        console.log('✅ Rol eliminado');
        setRoles(prev => prev.filter(role => role.id !== id));
        setError(null);
      }
      
      return true;
    } catch (err) {
      console.error('💥 Error en deleteRole:', err);
      if (isMounted()) {
        setError(err instanceof Error ? err.message : 'Error al eliminar rol');
      }
      return false;
    }
  };

  // Efecto para cargar roles al montar, con cleanup
  useEffect(() => {
    isMountedRef.current = true;
    
    // Cargar roles al montar
    fetchRoles();
    
    // Cleanup al desmontar
    return () => {
      isMountedRef.current = false;
      isLoadingRef.current = false;
    };
  }, []); // Sin dependencias para evitar re-renders

  // Función de refresh manual
  const refreshRoles = () => {
    fetchRoles(true); // Force refresh
  };

  return {
    roles,
    loading,
    error,
    createRole,
    updateRole,
    deleteRole,
    refreshRoles,
    setError
  };
}
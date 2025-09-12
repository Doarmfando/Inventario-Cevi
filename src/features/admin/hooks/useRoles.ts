// ==============================================
// ARCHIVO: src/features/admin/hooks/useRoles.ts
// Hook para manejar CRUD de roles
// ==============================================

import { useState, useEffect } from 'react';
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

  // Obtener todos los roles
  const fetchRoles = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('roles')
        .select('*')
        .eq('visible', true)
        .order('nombre');
      
      if (error) throw error;
      setRoles(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar roles');
    } finally {
      setLoading(false);
    }
  };

  // Crear rol
  const createRole = async (newRole: CreateRole): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('roles')
        .insert({
          nombre: newRole.nombre.toLowerCase(),
          descripcion: newRole.descripcion,
          visible: true
        })
        .select()
        .single();
      
      if (error) throw error;
      
      setRoles(prev => [...prev, data]);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear rol');
      return false;
    }
  };

  // Actualizar rol
  const updateRole = async (id: string, updates: Partial<CreateRole>): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('roles')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      setRoles(prev => prev.map(role => 
        role.id === id ? data : role
      ));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar rol');
      return false;
    }
  };

  // Eliminar rol (soft delete)
  const deleteRole = async (id: string): Promise<boolean> => {
    try {
      // Verificar que no haya usuarios con este rol
      const { count } = await supabase
        .from('usuarios')
        .select('id', { count: 'exact' })
        .eq('rol_id', id)
        .eq('visible', true);
      
      if (count && count > 0) {
        setError('No se puede eliminar un rol que tiene usuarios asignados');
        return false;
      }

      const { error } = await supabase
        .from('roles')
        .update({ visible: false })
        .eq('id', id);
      
      if (error) throw error;
      
      setRoles(prev => prev.filter(role => role.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar rol');
      return false;
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  return {
    roles,
    loading,
    error,
    createRole,
    updateRole,
    deleteRole,
    refreshRoles: fetchRoles,
    setError
  };
}